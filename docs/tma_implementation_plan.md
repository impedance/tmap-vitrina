# Comprehensive TMA Implementation Plan: Amazing Chocolate

This plan is based on a full-depth analysis of the `telegram_mini_app_plan.md`, `design_system_spec.md`, and `site_improvement_plan.md`. It aim to boost conversion and average order value (AOV) by aligning the TMA with the website's taxonomy while optimizing for the Telegram Mini App environment.

## Phase 0: Data & Foundation (Server + Logic)
The foundation of the shop is clean, descriptive product data.

### [Component] Schema & Seeding
- **[MODIFY] [schema.prisma](file:///home/spec/work/tmap-vitrina/server/prisma/schema.prisma)**: 
    - Add `isB2B` (boolean), `origin` (string), `cocoaPercent` (string), `flavorProfile` (string) fields.
- **[MODIFY] [seed.ts](file:///home/spec/work/tmap-vitrina/server/prisma/seed.ts)**: 
    - Seed with ~60% of products scraped from `amazingchoco.com`.
    - **B2B Flags**: Automatically mark 1kg+ items and raw ingredients (butter, beans) as B2B.
    - **Flavor Profiles**: Include sensory notes (e.g., "Caramel, vanilla") for micro-descriptions in listings.

## Phase 1: Navigation & Structure (User Experience)
Implementing the "Business-First" navigation model.

### [Component] Global Segments & Layout
- **[MODIFY] [App.tsx](file:///home/spec/work/tmap-vitrina/client/src/App.tsx)**: 
    - Implement 4-tab bottom navigation: **Home, Catalog, Cart, Orders/Profile**.
    - Configure Deep-linking for specific subcategories (e.g., `?category=vegan`).
- **[MODIFY] [Catalog.tsx](file:///home/spec/work/tmap-vitrina/client/src/pages/Catalog.tsx)**:
    - **B2C/B2B Switcher**: A global toggle in the header that persists across sessions.
    - **Category Chips**:
        - **Chocolate**: "Dark", "Milk", "White", "With Filling", "Russian Collection", "Cupuacu".
        - **Beverages**: Merged "Coffee" and "Hot Chocolate" (filtered by sub-chips).
        - **Superfood**: "Beans", "Butter", "Nibs".

### [Component] Home: The Sales Engine
- **[NEW] [Home.tsx](file:///home/spec/work/tmap-vitrina/client/src/pages/Home.tsx)**:
    - **Scenario Widgets (Gifts)**: "Under 3000₽", "For Colleagues", "To Impress".
    - **Status Widgets**: "Newest", "Award Winners" (social proof).
    - **Zero-state Search**: Display search history and "Popular" chips (e.g., "dark 70%") when the search is tapped.

## Phase 2: Product Conversion (Micro-UX)
Small details that drive the "Add to Cart" action.

### [Component] Product Listing
- **[MODIFY] [ProductCard.tsx](file:///home/spec/work/tmap-vitrina/client/src/components/catalog/ProductCard.tsx)**:
    - **Micro-Specs**: Show `Ecuador • 75%` directly below the title.
    - **Badges**: Standardize icons for `🌱 Vegan`, `🚫 No Sugar`, `🏆 Award`.
    - **Instant Upsell**: After "Add to Cart", show an non-intrusive snackbar: *"Wrap as a gift? (+100₽) [Yes]"*.

## Phase 3: Checkout & Retention
- **[MODIFY] [Cart.tsx](file:///home/spec/work/tmap-vitrina/client/src/pages/Cart.tsx)**:
    - Implement "Add Greeting Card" option with text input.
    - **Sticky Cart Widget**: A floating bar visible in Catalog/Home when cart is not empty.
- **[MODIFY] [Profile.tsx](file:///home/spec/work/tmap-vitrina/client/src/pages/Profile.tsx)**:
    - **Quick Reorder**: A prominent button in the order history for 1-click repeat purchases.

## Verification Plan
1. **B2B Flow**: Ensure raw ingredients (butter/beans) only appear in B2B mode.
2. **Theme Parity**: Verify UI follows `tg-theme` variables across light and dark modes.
3. **Deep Linking**: Test that clicking a link to "Vegan Chocolate" opens the catalog with the "Vegan" chip active.
4. **Performance**: Verify the 4-tab navigation feels smooth with no unnecessary API re-fetches.
