# InfinityBio — Product Data Specification

This document defines the two CSV files needed to populate the Saleor ecommerce store with complete, SEO-optimized product data.

---

## Overview

| CSV File                           | Purpose                                               | Rows                                             | Key                            |
| ---------------------------------- | ----------------------------------------------------- | ------------------------------------------------ | ------------------------------ |
| `infinitybio_products_catalog.csv` | Product creation: names, variants, prices, stock      | 1 row per **variant** (167 rows for 73 products) | `product_name` groups variants |
| `infinitybio_products_seo.csv`     | Enrichment: descriptions, attributes, FAQ, references | 1 row per **product** (73 rows)                  | `product_slug` matches catalog |

---

## CSV 1: Product Catalog (`infinitybio_products_catalog.csv`)

**Purpose:** Create products, variants, pricing, and stock in Saleor.

**Format:** UTF-8, comma-separated. Double-quote fields containing commas.

**Key rule:** One row per variant. Products with multiple variants have multiple rows sharing the same `product_name`.

### Columns

| #   | Column            | Type    | Required | Max Length | Description                                                                                                                                                                                                                                                                                                          |
| --- | ----------------- | ------- | -------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `product_name`    | text    | YES      | 200        | Product display name. Example: `BPC-157`                                                                                                                                                                                                                                                                             |
| 2   | `product_slug`    | text    | NO       | 200        | URL slug. Auto-generated from name if empty. Example: `bpc-157`                                                                                                                                                                                                                                                      |
| 3   | `product_type`    | text    | YES      | 100        | Must be one of: `Peptide`, `Peptide Blend`, `Hormone`, `Injectable`, `Injectable Blend`, `Supply`                                                                                                                                                                                                                    |
| 4   | `category`        | text    | YES      | 100        | Must be one of: `GLP-1 Receptor Agonists`, `Growth Factors`, `Growth Hormone`, `Growth Hormone Secretagogues`, `Hormones`, `Injectables`, `Nootropic Peptides`, `Peptide Blends`, `Peptides`, `Supplies`                                                                                                             |
| 5   | `description`     | text    | YES      | 1000       | Short product description (1 paragraph). Used as fallback if SEO CSV not provided.                                                                                                                                                                                                                                   |
| 6   | `variant_name`    | text    | YES      | 200        | Variant display name. Example: `5mg Vial`, `10mg Vial`. Must be unique within same product.                                                                                                                                                                                                                          |
| 7   | `sku`             | text    | YES      | 50         | Globally unique SKU. Example: `BPC157-5MG`                                                                                                                                                                                                                                                                           |
| 8   | `price_usd`       | decimal | YES      | —          | Selling price in USD. Dot decimal separator, no currency symbol. Example: `45.00`                                                                                                                                                                                                                                    |
| 9   | `cost_price_usd`  | decimal | NO       | —          | Cost/purchase price in USD. Leave empty if unknown. Example: `12.50`                                                                                                                                                                                                                                                 |
| 10  | `stock_quantity`  | integer | YES      | —          | Available stock. Must be >= 0. Example: `100`                                                                                                                                                                                                                                                                        |
| 11  | `weight_kg`       | decimal | NO       | —          | Weight in kilograms. Example: `0.05`                                                                                                                                                                                                                                                                                 |
| 12  | `seo_title`       | text    | NO       | 60         | Meta title. Overridden by SEO CSV if provided.                                                                                                                                                                                                                                                                       |
| 13  | `seo_description` | text    | NO       | 155        | Meta description. Overridden by SEO CSV if provided.                                                                                                                                                                                                                                                                 |
| 14  | `image_filename`  | text    | NO       | 200        | Image filename. Images uploaded separately. Example: `bpc-157.jpg`                                                                                                                                                                                                                                                   |
| 15  | `collection`      | text    | NO       | 100        | Collection name. Must be one of: `Accessories`, `Aesthetics`, `Anti-Aging & Longevity`, `Cognitive & Mood`, `Fertility & Hormonal`, `Growth & Recovery`, `Immune Support`, `Performance`, `Recovery & Healing`, `Sexual Health`, `Sleep & Recovery`, `Tanning & Skin`, `Vitamins & Supplements`, `Weight Management` |
| 16  | `is_published`    | boolean | YES      | —          | `true` or `false`. Whether visible on storefront.                                                                                                                                                                                                                                                                    |

### Consistency Rules

- All rows sharing the same `product_name` must have identical values for: `product_type`, `category`, `description`, `seo_title`, `seo_description`, `image_filename`, `collection`, `is_published`.
- `sku` must be globally unique across all rows.
- `variant_name` must be unique within the same product.

### Example

```csv
product_name,product_slug,product_type,category,description,variant_name,sku,price_usd,cost_price_usd,stock_quantity,weight_kg,seo_title,seo_description,image_filename,collection,is_published
BPC-157,bpc-157,Peptide,Peptides,Body Protection Compound-157 is a synthetic pentadecapeptide...,5mg Vial,BC5,138.00,46.00,100,0.05,,,bpc-157.jpg,Recovery & Healing,true
BPC-157,bpc-157,Peptide,Peptides,Body Protection Compound-157 is a synthetic pentadecapeptide...,10mg Vial,BC10,201.00,67.00,100,0.05,,,bpc-157.jpg,Recovery & Healing,true
BPC-157,bpc-157,Peptide,Peptides,Body Protection Compound-157 is a synthetic pentadecapeptide...,20mg Vial,BC20,357.00,119.00,100,0.05,,,bpc-157.jpg,Recovery & Healing,true
```

---

## CSV 2: SEO & Content Enrichment (`infinitybio_products_seo.csv`)

**Purpose:** Add rich descriptions, scientific attributes, FAQs, and research references to existing products. This data drives the product detail page content and structured data (JSON-LD) for Google.

**Format:** UTF-8, comma-separated. Double-quote fields containing commas or line breaks.

**Key rule:** One row per product, 73 rows total. Matched to products via `product_slug`.

### Columns

| #   | Column              | Type | Required | Max Length | Description                                                                                                                                                                                                     |
| --- | ------------------- | ---- | -------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `product_slug`      | text | YES      | 200        | Must match an existing product slug from the catalog CSV. Example: `bpc-157`                                                                                                                                    |
| 2   | `description_p1`    | text | YES      | 500        | Paragraph 1: What the compound is. Scientific, factual.                                                                                                                                                         |
| 3   | `description_p2`    | text | YES      | 500        | Paragraph 2: Mechanism of action, what researchers study it for.                                                                                                                                                |
| 4   | `description_p3`    | text | YES      | 500        | Paragraph 3: InfinityBio quality — purity, testing methodology, form.                                                                                                                                           |
| 5   | `purity`            | text | YES      | 50         | Purity specification. Example: `≥98% (HPLC)`                                                                                                                                                                    |
| 6   | `form`              | text | YES      | 50         | One of: `Lyophilized Powder`, `Solution`, `Liquid`, `Tablet`, `Capsule`, `Powder`                                                                                                                               |
| 7   | `storage`           | text | YES      | 150        | Storage conditions. Example: `-20°C, protect from light and moisture`                                                                                                                                           |
| 8   | `molecular_weight`  | text | NO       | 50         | Molecular weight with unit. Example: `1206.4 Da`. Leave empty for supplies/simple injectables.                                                                                                                  |
| 9   | `cas_number`        | text | NO       | 50         | CAS registry number. Example: `137525-51-0`. Leave empty if none exists.                                                                                                                                        |
| 10  | `sequence`          | text | NO       | 500        | Amino acid sequence (single-letter or three-letter). Leave empty for non-peptides. Example: `Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val`                                                       |
| 11  | `origin`            | text | YES      | 20         | One of: `Synthetic`, `Recombinant`, `Natural`                                                                                                                                                                   |
| 12  | `solubility`        | text | YES      | 200        | Solubility information. Example: `Soluble in sterile water, bacteriostatic water, or 0.1% acetic acid`                                                                                                          |
| 13  | `research_category` | text | YES      | 100        | Research field. Example: `Tissue Repair & Recovery`, `GLP-1 Receptor Agonist`, `Metabolic Regulation`                                                                                                           |
| 14  | `seo_title`         | text | YES      | 60         | Meta title. Format: `{Product} {dose range} \| InfinityBio Labs`. Example: `BPC-157 5mg-20mg \| InfinityBio Labs`                                                                                               |
| 15  | `seo_description`   | text | YES      | 155        | Meta description. Must include: compound name, purity, research area, call to action. Example: `Buy BPC-157 ≥98% purity. Research peptide for tissue repair studies. Lab-tested, COA available. Fast shipping.` |
| 16  | `faq_1_q`           | text | YES      | 200        | FAQ question 1. Pattern: `What is {product}?`                                                                                                                                                                   |
| 17  | `faq_1_a`           | text | YES      | 500        | FAQ answer 1. Factual, research-only framing.                                                                                                                                                                   |
| 18  | `faq_2_q`           | text | YES      | 200        | FAQ question 2. Pattern: `How should {product} be stored?`                                                                                                                                                      |
| 19  | `faq_2_a`           | text | YES      | 500        | FAQ answer 2.                                                                                                                                                                                                   |
| 20  | `faq_3_q`           | text | YES      | 200        | FAQ question 3. Pattern: `What purity is your {product}?`                                                                                                                                                       |
| 21  | `faq_3_a`           | text | YES      | 500        | FAQ answer 3.                                                                                                                                                                                                   |
| 22  | `faq_4_q`           | text | NO       | 200        | FAQ question 4 (optional). Pattern: `How is {product} supplied?`                                                                                                                                                |
| 23  | `faq_4_a`           | text | NO       | 500        | FAQ answer 4.                                                                                                                                                                                                   |
| 24  | `faq_5_q`           | text | NO       | 200        | FAQ question 5 (optional). Pattern: `What research has been done on {product}?`                                                                                                                                 |
| 25  | `faq_5_a`           | text | NO       | 500        | FAQ answer 5.                                                                                                                                                                                                   |
| 26  | `ref_1`             | text | NO       | 300        | Research citation 1. Format: `Author et al. (Year). "Title." Journal, Vol(Issue), Pages. PMID: XXXXX`                                                                                                           |
| 27  | `ref_2`             | text | NO       | 300        | Research citation 2.                                                                                                                                                                                            |
| 28  | `ref_3`             | text | NO       | 300        | Research citation 3.                                                                                                                                                                                            |

### Content Guidelines

**Language rules (CRITICAL for compliance):**

- NEVER use: "treats", "cures", "heals", "helps with", "improves", "benefits"
- ALWAYS use: "studied for", "investigated for", "researched for", "shown in studies to"
- Every product page implies "For Research Use Only"
- Frame all content as educational and scientific

**Description paragraphs:**

- **P1 — What it is:** Scientific identity. Name, classification, what it is chemically. Keep factual.
  > "BPC-157 (Body Protection Compound-157) is a synthetic pentadecapeptide consisting of 15 amino acids, derived from a protein found in human gastric juice. It is classified as a stable gastric pentadecapeptide."
- **P2 — Research applications:** What the scientific community studies it for. Cite mechanisms, not outcomes.
  > "BPC-157 has been extensively investigated in research settings for its interactions with the nitric oxide system, growth factor expression, and tendon-to-bone healing pathways. Published studies have examined its effects on angiogenesis and soft tissue repair models."
- **P3 — InfinityBio quality:** Why buy from us. Purity, testing, handling.
  > "Each vial from InfinityBio Labs contains lyophilized BPC-157 verified at ≥98% purity via HPLC analysis. All batches undergo third-party testing with Certificates of Analysis available upon request. Supplied as a white lyophilized powder for reconstitution."

**FAQ answers:**

- 3 FAQs required minimum, 5 maximum
- Answers should be 2-4 sentences
- Use the same research-only framing as descriptions
- Include practical information (storage, reconstitution, purity verification)

**Research references:**

- Use real PubMed citations when available
- Format: `Author et al. (Year). "Study title." Journal Name, Volume(Issue), Pages. PMID: 12345678`
- For compounds without published research, leave `ref_1`, `ref_2`, `ref_3` empty
- Do NOT invent citations

**SEO title formula:**

- Under 60 characters
- Format: `{Product Name} {dose range} | InfinityBio Labs`
- Examples:
  - `BPC-157 5mg-20mg | InfinityBio Labs` (36 chars)
  - `Semaglutide 2mg-30mg | InfinityBio Labs` (40 chars)
  - `Bacteriostatic Water | InfinityBio Labs` (40 chars)

**SEO description formula:**

- Under 155 characters
- Must include: product name, purity (if applicable), primary research area, CTA
- Example: `Buy BPC-157 ≥98% purity. Research peptide for tissue repair studies. Lab-tested, COA available. Fast shipping.` (111 chars)

### Product Type Specifics

| Product Type     | molecular_weight | cas_number    | sequence | Notes                             |
| ---------------- | ---------------- | ------------- | -------- | --------------------------------- |
| Peptide          | YES              | YES           | YES      | Full scientific data expected     |
| Peptide Blend    | YES (of blend)   | NO (multiple) | Optional | List components in description    |
| Hormone          | YES              | YES           | NO       | Standard pharma-style data        |
| Injectable       | Optional         | Optional      | NO       | Focus on concentration, volume    |
| Injectable Blend | Optional         | NO            | NO       | List components in description    |
| Supply           | NO               | Optional      | NO       | Focus on specs: volume, sterility |

### Example Row

```csv
product_slug,description_p1,description_p2,description_p3,purity,form,storage,molecular_weight,cas_number,sequence,origin,solubility,research_category,seo_title,seo_description,faq_1_q,faq_1_a,faq_2_q,faq_2_a,faq_3_q,faq_3_a,faq_4_q,faq_4_a,faq_5_q,faq_5_a,ref_1,ref_2,ref_3
bpc-157,"BPC-157 (Body Protection Compound-157) is a synthetic pentadecapeptide consisting of 15 amino acids, derived from a protective protein found in human gastric juice. It is classified as a stable gastric pentadecapeptide with the sequence Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val.","BPC-157 has been extensively investigated in research for its interactions with the nitric oxide (NO) system, growth factor modulation (including EGF, VEGF, and FGF), and the FAK-paxillin pathway. Published studies have examined its role in angiogenesis models, tendon-to-bone healing, and gastrointestinal cytoprotection in various animal models.","Each vial from InfinityBio Labs contains lyophilized BPC-157 verified at ≥98% purity via HPLC analysis. All batches undergo independent third-party testing with full Certificates of Analysis available upon request. Supplied as a white lyophilized powder in a sealed sterile vial, suitable for reconstitution with sterile or bacteriostatic water.",≥98% (HPLC),Lyophilized Powder,"-20°C, protect from light and moisture. Reconstituted solution: 2-8°C, use within 14 days.",1419.53 Da,137525-51-0,Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val,Synthetic,"Soluble in sterile water, bacteriostatic water (0.9% benzyl alcohol)",Tissue Repair & Cytoprotection,BPC-157 5mg-20mg | InfinityBio Labs,"Buy BPC-157 ≥98% purity. Research peptide studied for tissue repair. Third-party tested, COA available. Fast shipping.",What is BPC-157?,"BPC-157 is a synthetic pentadecapeptide of 15 amino acids derived from a segment of human gastric juice protein. It is classified as a stable gastric pentadecapeptide and is widely used in research settings.",How should BPC-157 be stored?,"Store lyophilized BPC-157 at -20°C protected from light and moisture. After reconstitution, store at 2-8°C and use within 14 days. Avoid repeated freeze-thaw cycles.",What purity is your BPC-157?,"Our BPC-157 is verified at ≥98% purity via HPLC analysis. Each batch is independently tested by a third-party laboratory, and Certificates of Analysis are available for every lot.",How is BPC-157 supplied?,"BPC-157 is supplied as a white lyophilized (freeze-dried) powder in a sealed sterile glass vial. It should be reconstituted with sterile water or bacteriostatic water prior to use in research applications.",What research has been published on BPC-157?,"BPC-157 has been the subject of numerous published studies examining its interactions with growth factor pathways, the nitric oxide system, and tissue repair mechanisms. Research spans over two decades with studies published in peer-reviewed journals including the Journal of Physiology and Life Sciences.","Sikiric P. et al. (2018). ""Brain-gut axis and pentadecapeptide BPC 157: Theoretical and practical implications."" Current Neuropharmacology, 16(5), 566-583. PMID: 28974127","Seiwerth S. et al. (2014). ""BPC 157's effect on healing."" Journal of Physiology-Paris, 108(2-3), 141-149. PMID: 24530605","Vukojevic J. et al. (2022). ""Pentadecapeptide BPC 157 and the central nervous system."" Neural Regeneration Research, 17(3), 482-487. PMID: 34380874"
```

---

## Saleor Product Attributes (created during import)

The SEO CSV data maps to Saleor product attributes. These are added to each product type:

| Attribute         | Saleor Input Type                                                          | Applied To                      |
| ----------------- | -------------------------------------------------------------------------- | ------------------------------- |
| Purity            | `PLAIN_TEXT`                                                               | All types                       |
| Form              | `DROPDOWN` (Lyophilized Powder, Solution, Liquid, Tablet, Capsule, Powder) | All types                       |
| Storage           | `PLAIN_TEXT`                                                               | All types                       |
| Molecular Weight  | `PLAIN_TEXT`                                                               | Peptide, Peptide Blend, Hormone |
| CAS Number        | `PLAIN_TEXT`                                                               | Peptide, Peptide Blend, Hormone |
| Sequence          | `PLAIN_TEXT`                                                               | Peptide, Peptide Blend          |
| Origin            | `DROPDOWN` (Synthetic, Recombinant, Natural)                               | All types                       |
| Solubility        | `PLAIN_TEXT`                                                               | All types                       |
| Research Category | `PLAIN_TEXT`                                                               | All types                       |

FAQs and research references are stored as **product metadata** (key-value pairs):

- `faq_1_q`, `faq_1_a`, ... `faq_5_q`, `faq_5_a`
- `ref_1`, `ref_2`, `ref_3`

---

## Storefront Rendering

The product page uses this data as follows:

| Page Section                   | Data Source                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| Product name (H1)              | `product_name`                                                                                |
| Breadcrumb                     | `category`                                                                                    |
| Image gallery                  | Uploaded media                                                                                |
| Variant selector               | Variant names from catalog CSV                                                                |
| Price display                  | `price_usd` from selected variant                                                             |
| "Add to Cart"                  | Variant stock + channel listing                                                               |
| Description (accordion)        | `description_p1` + `description_p2` + `description_p3` → EditorJS blocks                      |
| Product Details (accordion)    | Saleor attributes: Purity, Form, Storage, Molecular Weight, CAS, Sequence, Origin, Solubility |
| FAQ (accordion)                | Product metadata: `faq_*` pairs                                                               |
| Research References            | Product metadata: `ref_*`                                                                     |
| "Research Use Only" banner     | Hardcoded                                                                                     |
| Shipping & Returns (accordion) | Hardcoded                                                                                     |

### JSON-LD Structured Data (auto-generated)

```json
{
	"@context": "https://schema.org",
	"@type": "Product",
	"name": "BPC-157",
	"description": "...",
	"image": ["..."],
	"sku": "BC5",
	"mpn": "137525-51-0",
	"brand": { "@type": "Brand", "name": "InfinityBio Labs" },
	"category": "Peptides",
	"offers": {
		"@type": "AggregateOffer",
		"lowPrice": "138.00",
		"highPrice": "357.00",
		"priceCurrency": "USD",
		"offerCount": 3,
		"availability": "https://schema.org/InStock",
		"itemCondition": "https://schema.org/NewCondition"
	},
	"additionalProperty": [
		{ "@type": "PropertyValue", "name": "Purity", "value": "≥98% (HPLC)" },
		{ "@type": "PropertyValue", "name": "Form", "value": "Lyophilized Powder" },
		{ "@type": "PropertyValue", "name": "CAS Number", "value": "137525-51-0" },
		{ "@type": "PropertyValue", "name": "Molecular Weight", "value": "1419.53 Da" }
	]
}
```

### FAQPage Schema (auto-generated from metadata)

```json
{
	"@context": "https://schema.org",
	"@type": "FAQPage",
	"mainEntity": [
		{
			"@type": "Question",
			"name": "What is BPC-157?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "BPC-157 is a synthetic pentadecapeptide..."
			}
		}
	]
}
```

---

## Import Pipeline

1. **Catalog CSV** → `import_products.py` → Creates products, variants, prices, stock, channel listings
2. **SEO CSV** → `import_seo.py` (to be built) → Updates descriptions, creates attributes, sets metadata (FAQs, refs), updates SEO fields
3. **Images** → `upload_image.py` → Uploads product media

All scripts are in `/storefront/product/` and target `http://localhost:8000/graphql/`.
