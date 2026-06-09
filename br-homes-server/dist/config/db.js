"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;
async function connectDB() {
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            await mongoose_1.default.connect(env_1.env.MONGODB_URI, {
                dbName: 'br-homes',
            });
            console.log(`✅ MongoDB connected: ${mongoose_1.default.connection.host}`);
            mongoose_1.default.connection.on('error', (err) => {
                console.error('❌ MongoDB runtime error:', err.message);
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.warn('⚠️  MongoDB disconnected');
            });
            return;
        }
        catch (err) {
            retries++;
            const message = err instanceof Error ? err.message : String(err);
            console.error(`❌ MongoDB connection attempt ${retries}/${MAX_RETRIES} failed: ${message}`);
            if (retries >= MAX_RETRIES) {
                console.error('❌ All MongoDB connection attempts exhausted. Exiting.');
                process.exit(1);
            }
            console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
    }
}
//# sourceMappingURL=db.js.map