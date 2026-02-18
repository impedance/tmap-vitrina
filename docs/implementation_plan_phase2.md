# Implementation Plan: Phase 2 - E-commerce & Payments

This plan outlines the steps to transform the product showcase into a fully functional shop with online payments and order management.

## User Review Required

> [!IMPORTANT]
> To enable **Telegram Payments**, you will need to:
> 1. Obtain a `PAYMENT_PROVIDER_TOKEN` from [@BotFather](https://t.me/botfather) (Connect Stripe, Payme, or another provider).
> 2. Provide the `ADMIN_CHAT_ID` where order notifications should be sent.

## Proposed Changes

### 1. Data Model & Backend Extensions
Update database to support complex product types and track sales.

- **[MODIFY] [schema.prisma](file:///home/spec/work/tmap-vitrina/server/prisma/schema.prisma)**
    - Add `variants` field to `Product` (JSON: `[{name, price_delta}]`).
    - [NEW] `Order` model: `id, customerInfo, items, totalPrice, status, paymentId`.
- **[NEW] [orders.ts](file:///home/spec/work/tmap-vitrina/server/src/routes/orders.ts)**
    - Endpoint to create invoices via Telegram API.
    - Webhook handler for `pre_checkout_query` and `successful_payment`.

---

### 2. Product Variants (Volume/Size)
Allow users to select options before buying.

- **[MODIFY] [Admin.tsx](file:///home/spec/work/tmap-vitrina/client/src/pages/Admin.tsx)**: Add dynamic input fields to manage variants (name and price adjustment).
- **[MODIFY] [ProductDetail.tsx](file:///home/spec/work/tmap-vitrina/client/src/pages/ProductDetail.tsx)**: Implement a selection UI (chips or segmented control) for variants.

---

### 3. Telegram Payments Integration
The core of the "Shop" experience.

- **Frontend**:
    - Replace "Contact Specialist" with a "Buy Now" button.
    - Use `WebApp.openInvoice(url, callback)` to trigger the native payment sheet.
- **Backend**:
    - Integration with `node-telegram-bot-api` or direct HTTPS calls to Telegram Bot API.
    - Generation of unique invoices with shipping options.

---

### 4. Admin Notifications
Automated alerts for new orders.

- **Backend**:
    - Trigger `bot.sendMessage` to the manager immediately after payment verification.
    - Include order details: Product name, Variant, Price, and Customer info.

## Verification Plan

### Automated Tests
- **API Tests**: Mock Telegram Webhook calls to verify order creation and status transitions.
- **Utility Tests**: Verify price calculation logic (Base Price + Variant Delta).

### Manual Verification
1. **Admin**: Create a product with 2 variants (+0$ and +10$).
2. **Showcase**: Select the +10$ variant, verify price updates to 110$.
3. **Checkout**: Click Buy, simulate payment in Telegram Sandbox.
4. **Notification**: Verify manager receives a Telegram message with order details.
