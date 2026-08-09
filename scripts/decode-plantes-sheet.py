# -*- coding: utf-8 -*-
"""
Décode le sheet Google "Liste de Plantes Vivaces utiles en Permaculture pour
le Québec" vers un JSON prêt à importer dans la table `plantes` (voir
import-plantes.mts). Source : scripts/data/sheet_plantes.csv, exportée via
https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv&gid=<GID>

Usage : python3 scripts/decode-plantes-sheet.py
"""
import csv
import os
import json
import re
import unicodedata

SRC = os.path.join(os.path.dirname(__file__), "data", "sheet_plantes.csv")
OUT = os.path.join(os.path.dirname(__file__), "data", "plantes_final.json")
REVIEW_OUT = os.path.join(os.path.dirname(__file__), "data", "plantes_review.json")

PICTO_LUMIERE = {"○": "plein soleil", "◐": "mi-ombre", "●": "ombre"}
PICTO_EAU = {"▁": "peu", "▅": "moyen", "█": "beaucoup"}
PICTO_TEXTURE = {"░": "léger", "▒": "moyen", "▓": "lourd"}

FORME_MAP = {"A": "arbre", "AR": "arbuste", "H": "herbacée", "G": "grimpante", "GH": "herbacée grimpante", "HG": "herbacée grimpante"}
RACINE_MAP = {"B": "bulbe", "C": "charnu", "D": "drageonnante", "F": "fasciculé", "L": "latérales", "P": "pivotante", "R": "rhizome", "S": "superficiel", "T": "tubercule"}
VIE_SAUVAGE_MAP = {"N": ["nourriture"], "A": ["abri"], "NA": ["nourriture", "abri"]}
POLLINISATEUR_MAP = {"S": "spécialistes", "G": "généralistes", "V": "vent"}
UTIL_ECO_MAP = {"BR": "bande riveraine", "P": "pentes", "Z": "zone inondable"}
COMESTIBLE_MAP = {"FL": "fleur", "FR": "fruit", "FE": "feuille", "N": "noix", "G": "graine", "R": "racine", "S": "sève", "JP": "jeune pousse", "T": "tige", "B": "bulbe", "E": "baie", "GR": "graine"}
PERIODE_MAP = {"P": "printemps", "É": "été", "E": "été", "A": "automne"}
COULEUR_FLORAISON_MAP = {"RG": "rouge", "RS": "rose", "B": "blanc", "J": "jaune", "O": "orangé", "P": "pourpre", "V": "verte", "BR": "brun", "BL": "bleu"}
COULEUR_FEUILLAGE_MAP = {"V": "vert", "PO": "pourpre", "PA": "panaché", "P": "pâle", "F": "foncé", "T": "tacheté", "J": "jaune"}
INTERET_AH_MAP = {"A": "automnal", "H": "hivernal"}
RYTHME_MAP = {"R": "rapide", "M": "moyen", "L": "lent"}
COMBO_TAILLE_METHODE = {"AD": "avant le débourrement", "AF": "après la floraison", "N": "ne pas tailler"}
COMBO_TAILLE_MOMENT = {"P": "printemps", "É": "été", "E": "été", "A": "automne", "T": "en tout temps"}
COMBO_MULT_METHODE = {"B": "bouturage", "M": "marcottage", "D": "division", "S": "semis", "G": "greffe", "ST": "stolon"}
COMBO_MULT_MOMENT = {"P": "printemps", "A": "automne", "É": "été", "E": "été", "T": "tubercule"}
INCONVENIENT_MAP = {"E": "expansif", "D": "dispersif", "A": "allergène", "P": "poison", "ÉPI": "épineux", "EPI": "épineux", "V": "vigne vigoureuse", "B": "brûlure", "G": "grimpant invasif", "PE": "persistant"}

WARNINGS = []


def slugify(genre, espece, seen):
    text = f"{genre or ''} {espece or ''}".strip().lower()
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-") or "plante-inconnue"
    base = text
    n = 2
    while text in seen:
        text = f"{base}-{n}"
        n += 1
    seen.add(text)
    return text


def clean(v):
    if v is None:
        return ""
    return str(v).strip()


def is_na(v):
    return v.strip() == "*"


def is_unknown(v):
    return v.strip() == "?"


def decode_bool(v):
    v = v.strip()
    if v.upper() == "X":
        return True
    if is_na(v):
        return False
    return None


def decode_picto_list(v, mapping):
    v = v.strip()
    if not v or is_na(v):
        return []
    return [mapping[ch] for ch in v if ch in mapping]


def decode_token_list(v, mapping, slug, colonne):
    v = v.strip()
    if not v or is_na(v) or is_unknown(v):
        return []
    out = []
    for raw_token in v.split(","):
        raw_token = raw_token.strip()
        if not raw_token:
            continue
        for token in raw_token.split("-"):
            token = token.strip()
            if not token:
                continue
            key = token.upper()
            if key in mapping:
                mapped = mapping[key]
                out.extend(mapped if isinstance(mapped, list) else [mapped])
                continue
            # Tente de décoder une combinaison de codes 1-lettre collés sans séparateur (ex: "VP" -> V + P)
            if len(key) > 1 and all(ch in mapping for ch in key):
                for ch in key:
                    mapped = mapping[ch]
                    out.extend(mapped if isinstance(mapped, list) else [mapped])
                continue
            out.append(f"[non-mappé:{token}]")
            WARNINGS.append({"slug": slug, "colonne": colonne, "valeur_brute": v, "probleme": f"token non reconnu: '{token}'"})
    return out


def decode_combo(v, methode_map, moment_map, slug, colonne):
    v = v.strip()
    if not v or is_na(v) or is_unknown(v):
        return []
    results = []
    for token in v.split(","):
        token = token.strip().upper()
        if not token:
            continue
        matched = False
        if token in moment_map:
            results.append(moment_map[token])
            matched = True
        if not matched:
            for m_code in sorted(methode_map, key=len, reverse=True):
                if token.startswith(m_code):
                    rest = token[len(m_code):]
                    if rest in moment_map:
                        results.append(f"{methode_map[m_code]} ({moment_map[rest]})")
                        matched = True
                        break
                    if rest == "":
                        results.append(methode_map[m_code])
                        matched = True
                        break
        if not matched:
            results.append(f"[non-décodé:{token}]")
            WARNINGS.append({"slug": slug, "colonne": colonne, "valeur_brute": v, "probleme": f"combo non résolu: '{token}'"})
    return results


def parse_decimal_range(v, slug, colonne):
    v = v.strip()
    if not v or is_na(v) or is_unknown(v):
        return (None, None)
    v = v.replace(",", ".").replace("–", "-").replace("—", "-")
    parts = [p for p in v.split("-") if p.strip()]
    nums = []
    for p in parts:
        m = re.match(r"^\d+(\.\d+)?", p.strip())
        if m:
            nums.append(float(m.group(0)))
    if not nums:
        WARNINGS.append({"slug": slug, "colonne": colonne, "valeur_brute": v, "probleme": "format non reconnu"})
        return (None, None)
    if len(nums) == 1:
        return (nums[0], nums[0])
    return (min(nums), max(nums))


def parse_pepinieres(v, slug):
    v = v.strip()
    if not v:
        return []
    nums = [int(n) for n in re.findall(r"\d+", v) if 1 <= int(n) <= 12]
    if re.search(r"[a-zA-Z]{3,}", v):
        WARNINGS.append({"slug": slug, "colonne": "Où peut-on la trouver?", "valeur_brute": v, "probleme": "contient du texte/URL"})
    return nums


def transform_row(row, seen_slugs):
    genre = clean(row.get("Genre"))
    espece = clean(row.get(" Espèce") or row.get("Espèce"))
    slug = slugify(genre, espece, seen_slugs)

    forme_raw = clean(row.get("Forme")).upper()
    forme = FORME_MAP.get(forme_raw)
    if forme_raw and not forme:
        WARNINGS.append({"slug": slug, "colonne": "Forme", "valeur_brute": forme_raw, "probleme": "code non reconnu"})

    ph_min, ph_max = parse_decimal_range(clean(row.get("pH (Min-Max)")), slug, "pH (Min-Max)")
    h_min, h_max = parse_decimal_range(clean(row.get("Hauteur(m)")), slug, "Hauteur(m)")
    l_min, l_max = parse_decimal_range(clean(row.get("Largeur(m)")), slug, "Largeur(m)")

    vie_sauvage_raw = clean(row.get("Vie sauvage")).upper()
    vie_sauvage = VIE_SAUVAGE_MAP.get(vie_sauvage_raw, [])
    if vie_sauvage_raw and vie_sauvage_raw not in VIE_SAUVAGE_MAP and not is_na(vie_sauvage_raw) and not is_unknown(vie_sauvage_raw):
        WARNINGS.append({"slug": slug, "colonne": "Vie sauvage", "valeur_brute": vie_sauvage_raw, "probleme": "code non reconnu"})

    texture_raw = clean(row.get("Texture du sol"))
    texture_sol = ["aquatique"] if "O" in texture_raw.upper() else decode_picto_list(texture_raw, PICTO_TEXTURE)

    record = {
        "slug": slug,
        "genre": genre,
        "espece": espece or None,
        "variete": None,
        "nomFrancais": clean(row.get("Nom français")) or None,
        "nomAnglais": clean(row.get("Nom Anglais")) or None,
        "zoneRusticite": clean(row.get("Zone de rusticité")) or None,
        "lumiere": decode_picto_list(clean(row.get("Lumière")), PICTO_LUMIERE),
        "eau": decode_picto_list(clean(row.get("Eau")), PICTO_EAU),
        "phMin": ph_min,
        "phMax": ph_max,
        "textureSol": texture_sol,
        "forme": forme,
        "racine": decode_token_list(clean(row.get("Racine")), RACINE_MAP, slug, "Racine"),
        "hauteurMinM": h_min,
        "hauteurMaxM": h_max,
        "largeurMinM": l_min,
        "largeurMaxM": l_max,
        "fixateurAzote": decode_bool(clean(row.get("Fixateur Azote"))),
        "accumulateurNutriments": decode_bool(clean(row.get("Accumulateur de Nutriments"))),
        "vieSauvage": vie_sauvage,
        "pollinisateurs": decode_token_list(clean(row.get("Pollinisateurs")), POLLINISATEUR_MAP, slug, "Pollinisateurs"),
        "couvreSol": decode_bool(clean(row.get("Couvre-sol"))),
        "haie": decode_bool(clean(row.get("Haie"))),
        "utilisationEcologique": decode_token_list(clean(row.get("Utilisation écologique")), UTIL_ECO_MAP, slug, "Utilisation écologique"),
        "comestible": decode_token_list(clean(row.get("Comestible")), COMESTIBLE_MAP, slug, "Comestible"),
        "medicinal": decode_bool(clean(row.get("Medicinal"))),
        "periodeFloraison": decode_token_list(clean(row.get("Période de floraison")), PERIODE_MAP, slug, "Période de floraison"),
        "couleurFloraison": decode_token_list(clean(row.get("Couleur de floraison")), COULEUR_FLORAISON_MAP, slug, "Couleur de floraison"),
        "couleurFeuillage": decode_token_list(clean(row.get("Couleur de feuillage")), COULEUR_FEUILLAGE_MAP, slug, "Couleur de feuillage"),
        "interetAutomneHiver": decode_token_list(clean(row.get("Intérêt automnale hivernal")), INTERET_AH_MAP, slug, "Intérêt automnale hivernal"),
        "rythmeCroissance": RYTHME_MAP.get(clean(row.get("Rythme de croissance")).upper()),
        "periodeTaille": decode_combo(clean(row.get("Période de taille")), COMBO_TAILLE_METHODE, COMBO_TAILLE_MOMENT, slug, "Période de taille"),
        "multiplication": decode_combo(clean(row.get("Multiplication")), COMBO_MULT_METHODE, COMBO_MULT_MOMENT, slug, "Multiplication"),
        "inconvenients": decode_token_list(clean(row.get("Inconvénient")), INCONVENIENT_MAP, slug, "Inconvénient"),
        "notes": clean(row.get("Notes")) or None,
        "cultivarsRecommandes": clean(row.get("Cultivars intéressants")) or None,
        "lienInfo": clean(row.get("Lien Information")) or None,
        "sourceSheet": "Liste de plantes utiles vivaces pour le Québec",
        "donneesBrutes": {k: v for k, v in row.items() if v and str(v).strip()},
        "verifie": False,
        "pepinieres": parse_pepinieres(clean(row.get("Où peut-on la trouver?")), slug),
    }
    return record


def main():
    with open(SRC, encoding="utf-8") as f:
        lines = f.readlines()
    # Ligne 0 = regroupements (TAXONOMIE...), ligne 1 = vrais en-têtes
    reader = csv.DictReader(lines[1:])
    seen_slugs = set()
    records = []
    for row in reader:
        genre = clean(row.get("Genre"))
        if not genre:
            continue
        records.append(transform_row(row, seen_slugs))

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    with open(REVIEW_OUT, "w", encoding="utf-8") as f:
        json.dump(WARNINGS, f, ensure_ascii=False, indent=2)

    print(f"{len(records)} plantes décodées -> {OUT}")
    print(f"{len(WARNINGS)} avertissements -> {REVIEW_OUT}")
    dup_slugs = len(records) - len(set(r['slug'] for r in records))
    print(f"Slugs dupliqués (dédupliqués automatiquement): vérifié={dup_slugs==0}")


if __name__ == "__main__":
    main()
