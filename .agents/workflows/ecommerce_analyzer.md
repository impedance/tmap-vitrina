---
description: Analyze e-commerce site structure and taxonomy using Firecrawl
---

When the user provides an e-commerce URL (e.g., a chocolate or gift shop) and asks you to analyze it, follow these steps strictly:

### Step 1: Broad Site Mapping
1. Call the Firecrawl `map` or `crawl` MCP tool on the provided target URL.
2. Analyze the output to identify the overall site taxonomy. Extract all links that correspond to main categories, subcategories, and important service pages.
3. Keep these raw links in your context; do not present them all to the user. Use them to understand the hierarchy.

### Step 2: Targeted Scraping
Select 3-4 essential, representative pages from the links discovered in Step 1:
1. The **Index / Homepage**.
2. One major **Category or Listing page** (e.g., "Chocolate candies" or "Gifts").
3. One typical **Product page** (e.g., a specific box of chocolates).

Use the Firecrawl `scrape` MCP tool to fetch the raw Markdown or structured content of these selected pages.

### Step 3: Deep Content Analysis
Based on the scraped content, trace and analyze the following aspects:
- **Hierarchy & Breadcrumbs:** How are items categorized? (e.g., Catalog > Gifts > Assortments).
- **Navigation & Filtering:** How does a user search the catalog? What filters are available (e.g., by weight, filling, price, occasion)?
- **Page Layouts:**
  - *Category page metadata:* Product grid structure, sorting options, pagination/infinite scroll.
  - *Product page metadata:* Essential fields (Price, images, description, reviews, similar items / "часто покупают вместе").

### Step 4: Final Output Generation
Construct a detailed, beautifully formatted Markdown report for the user containing:
1. **Category Tree (Структура каталога):** A clear, nested list illustrating the site's taxonomy.
2. **User Journey & Navigation (Путь пользователя):** A description of how navigation, filters, and cross-selling are organized.
3. **Page Archetypes (Шаблоны страниц):** What key elements are present on Category and Product pages.
4. **Conclusion (Выводы):** Strengths or interesting technical/structural choices made by the site.

**Execution Rule:** Perform steps 1 through 3 autonomously using your tools. Do not ask for intermediate confirmation unless an error occurs. Output only the final analytical report (Step 4) to the user.
