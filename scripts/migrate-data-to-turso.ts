import { PrismaClient as LocalClient } from "../src/generated/client";
import { PrismaClient as RemoteClient } from "../src/generated/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

async function migrate() {
    console.log("🔄 Starting Data Migration...");

    // 1. Setup Local Client
    const localAdapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
    const local = new LocalClient({ adapter: localAdapter });

    // 2. Setup Remote Client
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!tursoUrl || !authToken) {
        console.error("❌ Turso credentials missing");
        process.exit(1);
    }
    const remoteAdapter = new PrismaLibSql({ url: tursoUrl, authToken });
    const remote = new RemoteClient({ adapter: remoteAdapter });

    try {
        console.log("🧹 Cleaning Remote Tables (Reverse Order)...");
        // Delete in reverse order of dependencies
        await (remote as any).cabinetAppointment.deleteMany({});
        await (remote as any).cabinetClient.deleteMany({});
        await (remote as any).cabinetService.deleteMany({});
        await (remote as any).restaurantOrderItem.deleteMany({});
        await (remote as any).restaurantOrder.deleteMany({});
        await (remote as any).restaurantTable.deleteMany({});
        await (remote as any).restaurantWaiter.deleteMany({});
        await (remote as any).restaurantDish.deleteMany({});
        await (remote as any).restaurantCategory.deleteMany({});
        await (remote as any).tenantWebsite.deleteMany({});
        await (remote as any).userService.deleteMany({});
        await (remote as any).service.deleteMany({});
        await (remote as any).user.deleteMany({});
        console.log("✅ Remote database cleared.");

        // --- USERS ---
        const users = await local.user.findMany();
        console.log(`👤 Syncing ${users.length} Users...`);
        for (const u of users) {
            await (remote as any).user.create({ data: u });
        }

        // --- SERVICES ---
        const services = await local.service.findMany();
        console.log(`🛠️ Service Sync: ${services.length}`);
        for (const s of services) {
            await (remote as any).service.create({ data: s });
        }

        // --- USER SERVICES ---
        const userServices = await local.userService.findMany();
        console.log(`🔗 User-Service Links: ${userServices.length}`);
        for (const us of userServices) {
            await (remote as any).userService.create({ data: us });
        }

        // --- TENANT WEBSITES ---
        const websites = await local.tenantWebsite.findMany();
        console.log(`🌐 Websites: ${websites.length}`);
        for (const w of websites) {
            await (remote as any).tenantWebsite.create({ data: w });
        }

        // --- CABINET SERVICES ---
        const cabinetServices = await local.cabinetService.findMany();
        console.log(`💼 Cabinet Services: ${cabinetServices.length}`);
        for (const cs of cabinetServices) {
            await (remote as any).cabinetService.create({ data: cs });
        }

        // --- CABINET CLIENTS ---
        const cabinetClients = await local.cabinetClient.findMany();
        console.log(`👥 Cabinet Clients: ${cabinetClients.length}`);
        for (const cc of cabinetClients) {
            await (remote as any).cabinetClient.create({ data: cc });
        }

        // --- CABINET APPOINTMENTS ---
        const cabinetAppointments = await local.cabinetAppointment.findMany();
        console.log(`📅 Appointments: ${cabinetAppointments.length}`);
        for (const ca of cabinetAppointments) {
            await (remote as any).cabinetAppointment.create({ data: ca });
        }

        console.log("🎉 Mirroring Successful!");
    } catch (error) {
        console.error("❌ Migration Failed:", error);
    } finally {
        await local.$disconnect();
        await remote.$disconnect();
    }
}

migrate();
