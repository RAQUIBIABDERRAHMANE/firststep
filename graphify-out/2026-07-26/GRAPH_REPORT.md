# Graph Report - .  (2026-07-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 7651 nodes · 10905 edges · 272 communities (121 shown, 151 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 289 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b133a31d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.d.ts
- runtime/client.d.ts
- wasm-compiler-edge.js
- Button.tsx
- runtime/client.js
- getCurrentUser
- getWebsiteBySlug
- r
- mail.ts
- restaurant.ts
- useRestaurantLogic
- L
- cc
- prisma.ts
- ts
- PrismaClient
- cn
- addErrorMessage
- DesignSystemGenerator
- actions/auth.ts
- write
- ReportsClient.tsx
- toString
- slice
- devDependencies
- query_compiler_bg.js
- dependencies
- AnimationController
- campaigns.ts
- compilerOptions
- e
- admin.ts
- waiter/dashboard/page.tsx
- Wt
- bo
- wc
- KDSBoard.tsx
- app/[tenantSlug]/page.tsx
- index.js
- get
- Prisma__TenantWebsiteClient
- BankAccountDelegate
- BillSplitDelegate
- CabinetAppointmentDelegate
- CabinetClientDelegate
- CabinetServiceDelegate
- CampaignDelegate
- ChatMessageDelegate
- ChatSessionDelegate
- CustomWebsiteRequestDelegate
- EmailListDelegate
- EmailListMemberDelegate
- FactureCounterDelegate
- FactureRecordDelegate
- FactureTemplateDelegate
- IngredientDelegate
- InvoiceDelegate
- InvoiceItemDelegate
- InvoiceSettingsDelegate
- MedicalHistoryDelegate
- MedicalRecordDelegate
- NotificationDelegate
- PasswordResetDelegate
- PaymentRequestDelegate
- PrescriptionDelegate
- PrismaPromise
- RecipeItemDelegate
- RestaurantCategoryDelegate
- RestaurantDishDelegate
- RestaurantOrderDelegate
- RestaurantOrderItemDelegate
- RestaurantReportDelegate
- RestaurantReservationDelegate
- RestaurantSpaceDelegate
- RestaurantTableDelegate
- RestaurantWaiterDelegate
- ServiceDelegate
- TableCartSessionDelegate
- TablePrintRequestDelegate
- TenantWebsiteDelegate
- UserDelegate
- UserServiceDelegate
- WaiterShiftDelegate
- ai.ts
- DashboardCharts.tsx
- write
- SqlDriverAdapter
- e
- waiter.ts
- lc
- InventoryClient.tsx
- package.json
- Span
- CartContext.tsx
- app/layout.tsx
- Prisma__UserClient
- exports
- MergedExtensionsList
- FloorPlanCanvas.tsx
- spotlight-background.tsx
- client/package.json
- manifest.json
- Prisma__RestaurantTableClient
- import
- require
- F
- Prisma__CabinetClientClient
- RequestHandler
- react
- ./runtime/client
- #wasm-compiler-loader
- Engine
- index-browser.d.ts
- charts-bar-chart.tsx
- FactureCanvasClient.tsx
- Prisma__CabinetAppointmentClient
- Prisma__InvoiceClient
- Prisma__RestaurantOrderClient
- Prisma__RestaurantWaiterClient
- Prisma__ServiceClient
- al
- to
- migrate-and-seed-turso-custom.js
- edge.js
- Prisma__CabinetServiceClient
- Prisma__ChatSessionClient
- Prisma__EmailListMemberClient
- Prisma__IngredientClient
- Prisma__MedicalRecordClient
- Prisma__PaymentRequestClient
- Prisma__RestaurantCategoryClient
- Prisma__RestaurantDishClient
- Prisma__RestaurantReservationClient
- Prisma__RestaurantSpaceClient
- Prisma__UserServiceClient
- PrismaPromise_2
- TracingHelper
- handleRequestError
- check-db.js
- OrderStatusTimeline.tsx
- fix-colors.js
- update-custom-website-price.js
- client/index-browser.js
- Prisma__BillSplitClient
- Prisma__ChatMessageClient
- Prisma__CustomWebsiteRequestClient
- Prisma__EmailListClient
- Prisma__InvoiceItemClient
- Prisma__InvoiceSettingsClient
- Prisma__NotificationClient
- Prisma__PrescriptionClient
- Prisma__RestaurantOrderItemClient
- Prisma__RestaurantReportClient
- Prisma__TableCartSessionClient
- Prisma__TablePrintRequestClient
- Prisma__WaiterShiftClient
- ./edge
- ./extension
- ./index-browser
- ./runtime/index-browser
- ./runtime/wasm-compiler-edge
- TraceState
- text-animations-typewriter.tsx
- text-animations-word-highlight.tsx
- unsubscribe.ts
- r2.ts
- terms/page.tsx
- check-users.ts
- middleware.ts
- seed.ts
- check-template.ts
- seed-turso.ts
- Prisma__FactureRecordClient
- Prisma__FactureTemplateClient
- Prisma__PasswordResetClient
- ./generator-build
- Context
- DataLoader
- TypedSql
- admin/clients/page.tsx
- cabinet/admin/page.tsx
- cabinet/admin/services/page.tsx
- admin/menu/page.tsx
- admin/orders/page.tsx
- admin/tables/page.tsx
- waiter/page.tsx
- QRScanner.tsx
- prisma.config.ts
- init-turso.ts
- migrate-turso.mjs
- migrate-waiters.ts
- seed-custom-service.js
- Skip
- class-variance-authority
- clsx
- RichTextEditor
- eslint.config.mjs
- fast-check
- groq-sdk
- gsap
- html5-qrcode
- lucide-react
- next
- next.config.ts
- next-themes
- nodemailer
- prisma
- @prisma/adapter-libsql
- @prisma/client
- qrcode
- react-markdown
- @react-three/drei
- @react-three/fiber
- @react-three/postprocessing
- remeda
- sonner
- tailwindcss-animate
- three
- @tiptap/extension-image
- @aws-sdk/client-s3
- postcss.config.mjs
- sw.js
- AnyNull
- DbNull
- JsonNull
- AccelerateEngineConfig
- CallSite
- DecimalJsLike
- ExtendedSpanOptions
- JsonConvertible
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `getCurrentUser()` - 165 edges
2. `r()` - 92 edges
3. `Button` - 84 edges
4. `t()` - 65 edges
5. `Card` - 54 edges
6. `PrismaClient` - 51 edges
7. `CardContent` - 48 edges
8. `PrismaPromise` - 42 edges
9. `CardHeader` - 41 edges
10. `CardTitle` - 41 edges

## Surprising Connections (you probably didn't know these)
- `ElapsedTimer()` --indirect_call--> `t()`  [INFERRED]
  components/dashboard/restaurant/kds/KDSBoard.tsx → src/generated/client/runtime/wasm-compiler-edge.js
- `WaiterDashboard()` --indirect_call--> `t()`  [INFERRED]
  app/[tenantSlug]/waiter/dashboard/page.tsx → src/generated/client/runtime/wasm-compiler-edge.js
- `generateRecoveryCodes()` --indirect_call--> `c()`  [INFERRED]
  app/actions/auth.ts → src/generated/client/runtime/index-browser.js
- `createOrder()` --indirect_call--> `d()`  [INFERRED]
  app/actions/restaurant.ts → src/generated/client/runtime/index-browser.js
- `LiveFloorMonitor()` --indirect_call--> `t()`  [INFERRED]
  app/dashboard/restaurant/[tenantSlug]/tables/LiveFloorMonitor.tsx → src/generated/client/runtime/wasm-compiler-edge.js

## Import Cycles
- None detected.

## Communities (272 total, 151 thin omitted)

### Community 0 - "index.d.ts"
Cohesion: 0.00
Nodes (3824): AggregateBankAccount, AggregateBillSplit, AggregateCabinetAppointment, AggregateCabinetClient, AggregateCabinetService, AggregateCampaign, AggregateChatMessage, AggregateChatSession (+3816 more)

### Community 1 - "runtime/client.d.ts"
Cohesion: 0.01
Nodes (307): AccelerateExtensionFetch, AccelerateExtensionFetchDecorator, Action, ActiveConnectorType, Aggregate, AllModelsToStringIndex, ApplyOmit, Args (+299 more)

### Community 2 - "wasm-compiler-edge.js"
Cohesion: 0.02
Nodes (70): ul(), ai(), am(), as(), ba(), Bi(), clone(), _cloneInto() (+62 more)

### Community 3 - "Button.tsx"
Cohesion: 0.06
Nodes (56): EmailList, RecipientSelectorProps, User, Member, Message, PrintRequest, TableInfo, Message (+48 more)

### Community 4 - "runtime/client.js"
Cohesion: 0.02
Nodes (79): ae(), An(), ao(), as(), bi(), Br(), ca(), cancelAllTransactions() (+71 more)

### Community 5 - "getCurrentUser"
Cohesion: 0.04
Nodes (59): AboutPage(), metadata, getCurrentUser(), signOut(), deleteCampaign(), getCampaigns(), getChatHistory(), createCustomWebsiteRequest() (+51 more)

### Community 6 - "getWebsiteBySlug"
Cohesion: 0.05
Nodes (54): getCabinetAppointments(), getCabinetClients(), getCabinetServices(), createInvoice(), deleteInvoice(), generateInvoiceNumber(), getInvoice(), getInvoices() (+46 more)

### Community 7 - "r"
Cohesion: 0.05
Nodes (77): SignupSection(), a(), k(), l(), P(), y, #a(), Bp() (+69 more)

### Community 8 - "mail.ts"
Cohesion: 0.06
Nodes (51): requestPasswordReset(), confirmPayment(), createPaymentRequest(), getAllPendingPayments(), getBankAccount(), getPaymentRequest(), getUserPaymentRequests(), rejectPayment() (+43 more)

### Community 9 - "restaurant.ts"
Cohesion: 0.07
Nodes (50): createCabinetAppointment(), deleteCabinetService(), saveCabinetClient(), saveCabinetService(), chat(), getCabinetContext(), getRestaurantContext(), groq (+42 more)

### Community 10 - "useRestaurantLogic"
Cohesion: 0.07
Nodes (36): callWaiter(), createBillSplit(), getOrderDetails(), getOrderStatus(), requestBill(), DishCustomizationModalProps, RestaurantTemplateProps, QRScanner (+28 more)

### Community 11 - "L"
Cohesion: 0.06
Nodes (54): Ka(), #a(), apiKey(), cancelAllTransactions(), Ci(), cl(), commitTransaction(), connect() (+46 more)

### Community 12 - "cc"
Cohesion: 0.11
Nodes (52): Ac(), addErrorMessage(), addSuggestion(), asObject(), bc(), cc(), dc(), ec() (+44 more)

### Community 13 - "prisma.ts"
Cohesion: 0.04
Nodes (8): getRestaurantAnalytics(), AnalyticsClient(), Period, createPrismaClient(), g, withRetry(), imagesMap, servicePrices

### Community 14 - "ts"
Cohesion: 0.08
Nodes (50): Ae(), bc(), be(), concat(), dc(), el(), Es(), fc() (+42 more)

### Community 16 - "cn"
Cohesion: 0.05
Nodes (34): updateCabinetAppointmentStatus(), clearChatHistory(), AdminSidebarNav(), NavItem, AdminMarketingPage(), AIPage(), Appointment, CabinetCalendarClient() (+26 more)

### Community 17 - "addErrorMessage"
Cohesion: 0.12
Nodes (48): addErrorMessage(), addField(), addSuggestion(), Ar(), asObject(), Bm(), Bu(), ec() (+40 more)

### Community 18 - "DesignSystemGenerator"
Cohesion: 0.07
Nodes (32): BM25, detect_domain(), _load_csv(), BM25 ranking algorithm for text search, Lowercase, split, remove punctuation, filter short words, Build BM25 index from documents, Score all documents against query, Load CSV and return list of dicts (+24 more)

### Community 19 - "actions/auth.ts"
Cohesion: 0.08
Nodes (30): generateCode(), generateRecoveryCodes(), getRecoverySettings(), getSession(), maskEmail(), resend2FACode(), resetPassword(), saveRecoveryEmail() (+22 more)

### Community 20 - "write"
Cohesion: 0.08
Nodes (46): at(), addMarginSymbol(), afterNextNewline(), compare(), copy(), equals(), Fu(), getCurrentLineLength() (+38 more)

### Community 21 - "ReportsClient.tsx"
Cohesion: 0.09
Nodes (33): deleteReport(), downloadReportPdf(), generateMonthlyReport(), resendReportEmail(), GET(), getMonthLabel(), getStatusBadge(), MONTHS_EN (+25 more)

### Community 22 - "toString"
Cohesion: 0.07
Nodes (36): ba(), ci(), disconnect(), ea(), enabled(), er(), generate(), Gp() (+28 more)

### Community 23 - "slice"
Cohesion: 0.08
Nodes (36): C(), R(), se(), uc(), k(), alloc(), allocUnsafe(), allocUnsafeSlow() (+28 more)

### Community 24 - "devDependencies"
Cohesion: 0.06
Nodes (35): babel-plugin-react-compiler, dotenv, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, dotenv, eslint (+27 more)

### Community 25 - "query_compiler_bg.js"
Cohesion: 0.08
Nodes (13): g, ge(), I(), J(), le(), m(), q(), u() (+5 more)

### Community 26 - "dependencies"
Cohesion: 0.06
Nodes (31): bcryptjs, better-sqlite3, effect, framer-motion, @libsql/client, dependencies, bcryptjs, better-sqlite3 (+23 more)

### Community 27 - "AnimationController"
Cohesion: 0.13
Nodes (5): AnimationController, SpiralAnimation(), Star, Vector2D, Vector3D

### Community 28 - "campaigns.ts"
Cohesion: 0.12
Nodes (22): createCampaign(), getCampaign(), sendCampaign(), updateCampaign(), updateCampaignEmailLists(), updateCampaignRecipients(), EditCampaignPage(), PageProps (+14 more)

### Community 29 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 30 - "e"
Cohesion: 0.13
Nodes (22): ar(), destroy(), digest(), digestInto(), dp(), e(), finish(), Is() (+14 more)

### Community 31 - "admin.ts"
Cohesion: 0.11
Nodes (19): adminCancelPaymentRequest(), adminToggleUserService(), deleteUser(), getAllUsersWithServices(), getPrintRequests(), toggleServiceStatus(), updateCustomWebsiteRequestStatus(), updatePrintRequestStatus() (+11 more)

### Community 32 - "waiter/dashboard/page.tsx"
Cohesion: 0.15
Nodes (18): createOrder(), endWaiterShift(), startWaiterShift(), getWaiterOrders(), formatTableLabel(), playChime(), showBrowserNotification(), TakeOrderModal() (+10 more)

### Community 33 - "Wt"
Cohesion: 0.08
Nodes (26): addItem(), $c(), Cd(), Ce(), De(), dr(), el(), getGlobalOmit() (+18 more)

### Community 34 - "bo"
Cohesion: 0.11
Nodes (23): au(), bo(), Bt(), cu(), dn(), eu(), fe(), G() (+15 more)

### Community 35 - "wc"
Cohesion: 0.20
Nodes (22): findField(), fo(), getAllComputedFields(), getArgumentName(), getArgumentPath(), getComputedFields(), getOrCreate(), getOutputTypeDescription() (+14 more)

### Community 36 - "KDSBoard.tsx"
Cohesion: 0.12
Nodes (18): getOrdersForKDS(), KdsPage(), ElapsedTimer(), getUrgency(), KanbanColumnProps, KDSBoard(), KDSBoardProps, OrderTicketCard() (+10 more)

### Community 37 - "app/[tenantSlug]/page.tsx"
Cohesion: 0.14
Nodes (13): metadata, BookingPage(), Props, generateMetadata(), Props, TenantLayout(), Props, TenantPage() (+5 more)

### Community 38 - "index.js"
Cohesion: 0.12
Nodes (8): adapter, prisma, config, path, Prisma, PrismaClient, {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  DbNull,
  JsonNull,
  AnyNull,
  NullTypes,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
}, empty()

### Community 39 - "get"
Cohesion: 0.11
Nodes (20): aa(), Bs(), ga(), get(), go(), jp(), #l(), ma() (+12 more)

### Community 65 - "PrismaPromise"
Cohesion: 0.11
Nodes (5): Prisma__BankAccountClient, Prisma__CampaignClient, Prisma__FactureCounterClient, Prisma__MedicalHistoryClient, PrismaPromise

### Community 83 - "ai.ts"
Cohesion: 0.16
Nodes (12): generateEmailContent(), generateWebsiteSuggestions(), getAIComboRecommendations(), groq, improveEmailPrompt(), Combo, CombosClient(), CombosClientProps (+4 more)

### Community 84 - "DashboardCharts.tsx"
Cohesion: 0.16
Nodes (9): AdminChartsProps, ChartData, DashboardChartsProps, DonutData, AreaChartCard(), AreaChartCardProps, BarChartCard(), BarChartCardProps (+1 more)

### Community 85 - "write"
Cohesion: 0.22
Nodes (17): addMarginSymbol(), afterNextNewline(), getCurrentLineLength(), getPrintWidth(), indent(), newLine(), setColor(), underline() (+9 more)

### Community 86 - "SqlDriverAdapter"
Cohesion: 0.12
Nodes (7): AdapterInfo, DriverAdapterFactory, Queryable, SqlDriverAdapter, SqlDriverAdapterFactory, SqlQueryable, $transaction()

### Community 87 - "e"
Cohesion: 0.18
Nodes (17): Ca(), destroy(), digest(), digestInto(), e(), finish(), hp(), keccak() (+9 more)

### Community 88 - "waiter.ts"
Cohesion: 0.19
Nodes (11): getSpaces(), createWaiter(), deleteWaiter(), getWaiters(), loginWaiter(), updateWaiter(), WaitersPage(), formatTableLabel() (+3 more)

### Community 89 - "lc"
Cohesion: 0.17
Nodes (15): addItem(), bs(), _c(), eo(), fs(), getAllClientExtensions(), getAllModelExtensions(), je() (+7 more)

### Community 90 - "InventoryClient.tsx"
Cohesion: 0.23
Nodes (11): createIngredient(), deleteIngredient(), getInventory(), setDishRecipe(), updateIngredient(), Ingredient, InventoryClient(), InventoryClientProps (+3 more)

### Community 91 - "package.json"
Cohesion: 0.17
Nodes (11): name, prisma, seed, private, scripts, build, dev, lint (+3 more)

### Community 93 - "CartContext.tsx"
Cohesion: 0.24
Nodes (8): getCartFromServer(), syncCartToServer(), metadata, RestaurantTemplate(), CartContext, CartContextType, CartItem, CartProvider()

### Community 94 - "app/layout.tsx"
Cohesion: 0.22
Nodes (8): figtree, jakarta, metadata, playfair, RootLayout(), syne, Providers(), WebMCPInitializer()

### Community 96 - "exports"
Cohesion: 0.18
Nodes (11): default, exports, ./client, ./index, ./package.json, ./sql, default, import (+3 more)

### Community 98 - "FloorPlanCanvas.tsx"
Cohesion: 0.27
Nodes (9): createSpace(), deleteSpace(), saveFloorPlanLayout(), FloorPlanCanvas(), FloorPlanCanvasProps, FloorPlanObstacle, FloorPlanTable, Space (+1 more)

### Community 99 - "spotlight-background.tsx"
Cohesion: 0.20
Nodes (3): steps, SpotlightBackgroundProps, SpotlightProps

### Community 100 - "client/package.json"
Cohesion: 0.20
Nodes (9): @prisma/client-runtime-utils, browser, dependencies, @prisma/client-runtime-utils, main, name, sideEffects, types (+1 more)

### Community 101 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 103 - "import"
Cohesion: 0.33
Nodes (10): import, browser, default, edge-light, node, types, worker, workerd (+2 more)

### Community 104 - "require"
Cohesion: 0.33
Nodes (10): require, require, browser, default, edge-light, node, types, worker (+2 more)

### Community 105 - "F"
Cohesion: 0.31
Nodes (3): migrate(), F, w()

### Community 108 - "react"
Cohesion: 0.29
Nodes (7): createReservation(), DishCustomizationModal(), ReservationModal(), ReservationModalProps, RestaurantTemplateModern(), react, react

### Community 109 - "./runtime/client"
Cohesion: 0.25
Nodes (8): ./runtime/client, default, require, default, import, node, require, types

### Community 110 - "#wasm-compiler-loader"
Cohesion: 0.25
Nodes (8): imports, #main-entry-point, #wasm-compiler-loader, default, default, edge-light, worker, workerd

### Community 112 - "index-browser.d.ts"
Cohesion: 0.25
Nodes (7): Args, Exact, GetRuntimeOutput, Narrowable, Operation, Public, RuntimeName

### Community 114 - "FactureCanvasClient.tsx"
Cohesion: 0.33
Nodes (6): FactureCanvasClient(), FieldConfig, FIELDS, FieldStyle, FieldStyles, Positions

### Community 120 - "al"
Cohesion: 0.29
Nodes (7): al(), kd(), Nt(), Od(), T(), il(), rl()

### Community 121 - "to"
Cohesion: 0.29
Nodes (7): addField(), du(), mu(), Po(), so(), to(), ur()

### Community 122 - "migrate-and-seed-turso-custom.js"
Cohesion: 0.40
Nodes (5): client, { createClient }, dotenv, generateCuid(), main()

### Community 123 - "edge.js"
Cohesion: 0.33
Nodes (5): config, Prisma, PrismaClient, {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  DbNull,
  JsonNull,
  AnyNull,
  NullTypes,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
}, empty()

### Community 137 - "handleRequestError"
Cohesion: 0.33
Nodes (6): Iu(), handleAndLogRequestError(), handleRequestError(), nt(), sanitizeMessage(), vr()

### Community 138 - "check-db.js"
Cohesion: 0.40
Nodes (4): campaigns, Database, db, tables

### Community 139 - "OrderStatusTimeline.tsx"
Cohesion: 0.40
Nodes (3): OrderStatusTimelineProps, STATUS_INDEX, STEPS

### Community 141 - "update-custom-website-price.js"
Cohesion: 0.40
Nodes (3): { createClient }, dotenv, { PrismaClient }

### Community 142 - "client/index-browser.js"
Cohesion: 0.40
Nodes (3): {
  Decimal,
  DbNull,
  JsonNull,
  AnyNull,
  NullTypes,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
}, Prisma, PrismaClient

### Community 156 - "./edge"
Cohesion: 0.40
Nodes (5): default, import, require, types, ./edge

### Community 157 - "./extension"
Cohesion: 0.40
Nodes (5): ./extension, default, import, require, types

### Community 158 - "./index-browser"
Cohesion: 0.40
Nodes (5): ./index-browser, default, import, require, types

### Community 159 - "./runtime/index-browser"
Cohesion: 0.40
Nodes (5): ./runtime/index-browser, default, import, require, types

### Community 160 - "./runtime/wasm-compiler-edge"
Cohesion: 0.40
Nodes (5): ./runtime/wasm-compiler-edge, default, import, require, types

### Community 172 - "seed-turso.ts"
Cohesion: 0.67
Nodes (3): client, generateCuid(), seedDatabase()

### Community 176 - "./generator-build"
Cohesion: 0.50
Nodes (4): ./generator-build, default, import, require

## Knowledge Gaps
- **4537 isolated node(s):** `{fontFamily}`, `{fontFamily}`, `Props`, `Props`, `Props` (+4532 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **151 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `WaiterDashboard()` connect `waiter/dashboard/page.tsx` to `r`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `Notification` connect `waiter/dashboard/page.tsx` to `index.d.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `RichTextEditor()` connect `RichTextEditor` to `Button.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Are the 76 inferred relationships involving `r()` (e.g. with `k()` and `l()`) actually correct?**
  _`r()` has 76 INFERRED edges - model-reasoned connections that need verification._
- **Are the 52 inferred relationships involving `t()` (e.g. with `LiveFloorMonitor()` and `WaitersClient()`) actually correct?**
  _`t()` has 52 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{fontFamily}`, `{fontFamily}`, `Props` to the rest of the system?**
  _4537 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.d.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0005228758169934641 - nodes in this community are weakly interconnected._