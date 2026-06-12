# Carpetstory Journal: Content Manifest

Locks slugs, translationKeys, tracks and routes for all 24 pieces. Every batch follows this registry. Do not rename slugs after ingestion.

Routing: track `journal` renders under `/journal/`, track `resource` under `/wissen/`. English versions use the same paths behind the `/en/` prefix (adjust if the final i18n routing differs). Internal links in articles are written language-relative.

| # | Cluster | Track | translationKey | DE slug | EN slug |
|---|---|---|---|---|---|
| 1 | 1 | journal | india-handknotted-pillar | handgeknuepfte-teppiche-aus-indien | handknotted-rugs-from-india |
| 2 | 1 | journal | knot-density | knotendichte-verstehen | understanding-knot-density |
| 3 | 1 | journal | materials-wool-silk-bamboo | schurwolle-seide-bambusseide | wool-silk-bamboo-silk |
| 4 | 1 | journal | natural-dyes | pflanzliche-faerbung | natural-dyeing |
| 5 | 1 | journal | knot-types | persischer-oder-tuerkischer-knoten | persian-or-turkish-knot |
| 6 | 1 | journal | bhadohi | bhadohi-teppichherz-indiens | bhadohi-indias-carpet-heartland |
| 7 | 1 | resource | handknotted-vs-machine | handgeknuepft-oder-maschinell | handknotted-vs-machine-made |
| 8 | 2 | resource | trade-pillar | teppiche-fuer-objekt-und-projekt | rugs-for-contract-and-project |
| 9 | 2 | resource | custom-sizing | teppich-massanfertigung | made-to-measure-rugs |
| 10 | 2 | resource | color-matching | farbabstimmung-ral-pantone | color-matching-ral-pantone |
| 11 | 2 | resource | contract-durability | strapazierfaehigkeit-objektbereich | durability-contract-use |
| 12 | 2 | resource | direct-import | teppich-direktimport-indien | direct-import-rugs-india |
| 13 | 2 | resource | authenticity-checks | echten-teppich-erkennen | identify-genuine-handknotted-rug |
| 14 | 2 | resource | design-to-loom | vom-entwurf-zum-knoten | from-design-to-loom |
| 15 | 3 | journal | fair-craft-pillar | faire-teppiche-ohne-kinderarbeit | fair-rugs-without-child-labor |
| 16 | 3 | resource | certifications | goodweave-und-zertifizierung | goodweave-and-certification |
| 17 | 3 | journal | artisan-portraits | die-haende-hinter-dem-knoten | the-hands-behind-the-knot |
| 18 | 3 | journal | sustainability | nachhaltige-teppiche | sustainable-rugs |
| 19 | 3 | journal | traceability | rueckverfolgbarkeit | traceability |
| 20 | 4 | resource | care-pillar | teppichpflege | rug-care |
| 21 | 4 | resource | cleaning | teppich-richtig-reinigen | cleaning-handknotted-rugs |
| 22 | 4 | resource | moth-protection | mottenschutz-wollteppiche | moth-protection-wool-rugs |
| 23 | 4 | resource | repair-value | reparatur-und-werterhalt | repair-and-value-retention |
| 24 | 4 | resource | underfloor-heating | teppich-fussbodenheizung | rugs-underfloor-heating |

## Batch status
- Batch 1 (delivered): #8, #9, #12
- Batch 2 (delivered): #10, #11, #13, #14, #16 — Cluster 2 complete, original priority list complete
- Batch 3 (delivered): #1, #2, #7
- Batch 4 (delivered): #3, #4, #5, #6 — Cluster 1 complete
- Batch 5 (delivered): #15, #17, #18, #19 — Cluster 3 complete; portraits article ships with placeholder slots for real interviews
- Batch 6 (delivered): #20, #21, #22, #23, #24 — Cluster 4 complete

**SET COMPLETE: all 24 articles delivered in German and English (48 files).** Pre-publish gates: business facts verified by Aashrit, native German review of every DE file, /kontakt mapped to the real inquiry route, hero images generated to match the heroAlt briefs, portrait slots in #17 filled with consented real interviews.

The site build (Phases 0 to 4 of the plan) does not depend on remaining batches; articles ingest as plain file drops into the content folders.

## Placeholders that need real values before publish
- Inquiry CTA links point to `/kontakt`; map to the real inquiry route.
- `heroImage` / `ogImage` paths are conventions; generate the assets (Freepik pipeline) and match paths or update frontmatter.
- `author` is set to "Carpetstory"; a named founder author is stronger for E-E-A-T if Aashrit wants his name on them.
