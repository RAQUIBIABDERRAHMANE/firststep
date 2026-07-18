# 🗺️ Restaurant Service - Planned Features & Roadmap

This document outlines the detailed specifications, database models, technical architecture, and UI/UX flows for the upcoming improvements to the **FirstStep Restaurant Service**.

---

## 1. Client Experience & QR Code Ordering

### 1.1 Real-time Order Status Tracking (SSE / Polling)
*   **Overview**: Provide customers with a live visual timeline tracking their order lifecycle from the kitchen to their table.
*   **Proposed Schema Changes**:
    No schema changes are required as `RestaurantOrder.status` already supports status tracking. However, we will expose a real-time stream.
*   **Technical Implementation**:
    *   **Backend**: Create a Server-Sent Events (SSE) route at `/api/tenant/[tenantSlug]/orders/[orderId]/stream` that listens to database changes or updates in-memory using an Event Emitter.
    *   **Frontend**: In [useRestaurantLogic.ts](file:///d:/firststep%20env/firststep/components/tenant/restaurant/useRestaurantLogic.ts), replace the 5-second polling interval with an `EventSource` listener when an order is active.
*   **UI/UX Design**:
    *   A circular progress ring at the top of the client menu showing the current stage.
    *   A step-by-step progress timeline:
        1. 🕒 **Reçue (Pending)**: Kitchen has received the order.
        2. 🍳 **En préparation (Preparing)**: Chefs are actively cooking.
        3. 🛎️ **Prête (Ready)**: Dish is plated and waiting for a waiter.
        4. 🍽️ **Servie (Served)**: Order completed and delivered.

---

### 1.2 Split Bill & Payment System ("Partager l'Addition")
*   **Overview**: Allow groups sitting at the same table to split the final bill easily from their own mobile browsers.
*   **Proposed Database Changes**:
    Extend the order/payment tracking in [schema.prisma](file:///d:/firststep%20env/firststep/prisma/schema.prisma):
    ```prisma
    model BillSplit {
      id        String           @id @default(cuid())
      orderId   String
      order     RestaurantOrder  @relation(fields: [orderId], references: [id], onDelete: Cascade)
      type      String           // "EQUAL" or "ITEMIZED"
      parts     Int              @default(1)
      itemsPaid String           @default("[]") // JSON array of paid item IDs
      paidTotal Float            @default(0.0)
      status    String           @default("PENDING") // PENDING, PARTIALLY_PAID, PAID
      createdAt DateTime         @default(now())
    }
    ```
*   **Workflow**:
    *   **Equal Split**: A slider lets customers choose the number of splits (e.g., divide by 4). The app calculates the amount per person, and users can pay their portion.
    *   **Itemized Split**: The menu displays checkboxes next to each item ordered by the table. Customers check the items they consumed, and the system generates a subtotal for payment.
*   **UI/UX Design**:
    *   A "Partager l'addition" button on the checkout screen.
    *   An interactive checklist showing which items are already paid (disabled) and which ones are remaining (selectable).

---

### 1.3 Table Session Shared Carts (Multiplayer Cart)
*   **Overview**: Sync the shopping cart between multiple diners sitting at the same table so they can collaborate on a single order.
*   **Proposed Database Changes**:
    Create a temporary table session model to store current cart states:
    ```prisma
    model TableCartSession {
      id        String           @id @default(cuid())
      tableId   String           @unique
      table     RestaurantTable  @relation(fields: [tableId], references: [id], onDelete: Cascade)
      cartData  String           @default("[]") // JSON string of items currently in cart
      updatedAt DateTime         @updatedAt
    }
    ```
*   **Technical Implementation**:
    *   Integrate a lightweight WebSocket or SSE sync room. When a customer adds an item, the action triggers a server action that updates `TableCartSession.cartData`.
    *   All connected devices at that table receive the updated cart broadcast and sync their local `useCart` state automatically.

---

## 2. Waiter & Floor Staff Portal (`/waiter`)

### 2.1 Sound Notifications & Push Alerts
*   **Overview**: Alert waiters instantly when customers request assistance or ask for the bill.
*   **Technical Implementation**:
    *   **Browser Audio Context**: Store a high-quality warning sound (`bell.mp3` or `buzzer.wav`) in the `/public/sounds/` directory. Trigger the sound using JavaScript's `Audio` API on the waiter's dashboard.
    *   **Web Push Notifications**: Use the Service Worker Push API to trigger native system notifications on the waiter's phone/tablet even when the screen is locked or the browser is minimized.

---

### 2.2 Shift & Dynamic Table Assignment
*   **Overview**: Allow restaurant managers to assign waiters to specific floor zones or table lists for their current shift.
*   **Proposed Database Changes**:
    Update the `RestaurantWaiter` and `RestaurantTable` relations or add a shift model:
    ```prisma
    model WaiterShift {
      id        String           @id @default(cuid())
      waiterId  String
      waiter    RestaurantWaiter @relation(fields: [waiterId], references: [id], onDelete: Cascade)
      startTime DateTime         @default(now())
      endTime   DateTime?
      tableIds  String           // Comma-separated list of tables assigned for this shift
      isActive  Boolean          @default(true)
    }
    ```
*   **UI/UX Design**:
    *   Waiters log in with their secure 4-digit PIN.
    *   Upon entry, they check-in and choose or review their assigned tables/zones (e.g. "Main Hall Section B").
    *   The waiter dashboard filters alerts and table orders to display only their active tables, reducing noise on large floors.

---

### 2.3 Offline Order Taking (PWA)
*   **Overview**: Enable waiters to take orders at tables even with spotty Wi-Fi connections, syncing once back online.
*   **Technical Implementation**:
    *   Configure `next-pwa` or a custom Service Worker to cache Static Assets, category JSONs, and dish lists.
    *   **IndexedDB**: Store pending offline waiter orders in a local browser database (IndexedDB).
    *   **Sync Listener**: Register a `sync` event or poll the connection status using `navigator.onLine`. When connection is restored, bulk upload all cached orders to the backend.

---

## 3. Kitchen Display System (KDS / `/kds`)

### 3.1 Prep Station Routing
*   **Overview**: Direct food and beverage items to their respective preparation stations to prevent screen clutter.
*   **Proposed Database Changes**:
    Update `RestaurantDish` in [schema.prisma](file:///d:/firststep%20env/firststep/prisma/schema.prisma):
    ```prisma
    // Add to RestaurantDish model
    prepStation String @default("KITCHEN") // "KITCHEN", "BAR", "DESSERT", "COLD_PREP"
    ```
*   **Technical Implementation**:
    *   When an order is created, split the order items into sub-tickets by `prepStation`.
    *   The KDS view at `/dashboard/restaurant/[tenantSlug]/kds` will feature a dropdown/selector allowing the kitchen team to choose their view (e.g., "Bar Station View" will only show drinks like Coffee or Juices).

---

### 3.2 Preparation Speed Indicators
*   **Overview**: Help kitchen staff keep track of ticket ages and identify lagging orders.
*   **UI/UX Design**:
    *   Display a real-time counter on the top right of each active order ticket card.
    *   The card border or header color changes automatically based on the time elapsed since the order was placed:
        *   🟩 **Green (< 10 mins)**: Normal queue.
        *   🟨 **Yellow (10–20 mins)**: Attention required.
        *   🟥 **Red (> 20 mins)**: Delayed / Priority. Trigger a subtle pulse animation on the card.

---

## 4. Admin Hub & Analytics (`/dashboard/restaurant`)

### 4.1 Interactive 2D Floor Plan Builder
*   **Overview**: Replace the basic list of tables with an interactive layout builder matching the physical restaurant.
*   **Proposed Database Changes**:
    Update the `RestaurantTable` model in [schema.prisma](file:///d:/firststep%20env/firststep/prisma/schema.prisma):
    ```prisma
    // Add layout coordinates to RestaurantTable
    xPos        Float    @default(0.0)
    yPos        Float    @default(0.0)
    rotation    Float    @default(0.0)
    shape       String   @default("SQUARE") // "SQUARE", "ROUND", "RECTANGLE"
    ```
*   **UI/UX Design**:
    *   **Editor View**: A grid canvas where the manager can drag new tables, resize them, rotate them, and position them relative to walls, doors, and bars.
    *   **Live Dashboard View**: A visual map representation. Tables change colors dynamically:
        *   🟢 **Green**: Empty table.
        *   🔴 **Red**: Occupied (has active order). Hovering shows order summary and total spend.
        *   ⚠️ **Flashing Orange**: Waiter called or bill requested at this table.

---

### 4.2 Recipe & Inventory Stock Integration
*   **Overview**: Automatically track ingredient stock levels as dishes are prepared and served.
*   **Proposed Database Models**:
    ```prisma
    model Ingredient {
      id          String       @id @default(cuid())
      tenantId    String
      name        String
      stock       Float        @default(0.0) // current stock quantity
      unit        String       // "g", "kg", "pcs", "L", "ml"
      minStock    Float        @default(0.0) // safety threshold for alerts
      tenant      TenantWebsite @relation(fields: [tenantId], references: [id], onDelete: Cascade)
      recipes     RecipeItem[]
    }

    model RecipeItem {
      id           String         @id @default(cuid())
      dishId       String
      dish         RestaurantDish @relation(fields: [dishId], references: [id], onDelete: Cascade)
      ingredientId String
      ingredient   Ingredient     @relation(fields: [ingredientId], references: [id], onDelete: Cascade)
      quantity     Float          // Quantity consumed per dish
    }
    ```
*   **Inventory Decrement Workflow**:
    When a waiter flags an order item as `SERVED` or `PAID`:
    1. Fetch the recipe components (`RecipeItem`) for the dish.
    2. Subtract the required amount from `Ingredient.stock`.
    3. Trigger a dashboard notification or email alert if the stock falls below the `minStock` safety threshold.

---

### 4.3 AI Menu & Combo Recommendations
*   **Overview**: Analyze historical customer orders to suggest high-performing menu bundles and discount packages.
*   **Technical Implementation**:
    *   **Association Rule Mining**: Run a simple Apriori algorithm or transaction bundling analysis on the server actions.
    *   **AI Integration**: Send the product pair analytics to the Groq LLM API.
    *   **Output**: Generate recommendations showing:
        *   *Frequency*: "Tagine and Mint Tea are ordered together in 85% of dinners."
        *   *Action*: "Create a 'Traditional Combo' (Tagine + Mint Tea) for 95 MAD (saving 10 MAD) to increase sales by 12%."
