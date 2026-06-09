"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("./config/env");
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const property_routes_1 = __importDefault(require("./routes/property.routes"));
const owner_routes_1 = __importDefault(require("./routes/owner.routes"));
const saved_routes_1 = __importDefault(require("./routes/saved.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const slider_routes_1 = __importDefault(require("./routes/slider.routes"));
const sidebarAd_routes_1 = __importDefault(require("./routes/sidebarAd.routes"));
const User_model_1 = __importDefault(require("./models/User.model"));
const Setting_model_1 = __importDefault(require("./models/Setting.model"));
const app = (0, express_1.default)();
// Security & parsing middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.CLIENT_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging (dev only)
if (env_1.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'BR-Homes API is running', timestamp: new Date().toISOString() });
});
// No need to redirect for Auth.js anymore
const start = async () => {
    // 1. Connect to MongoDB
    await mongoose_1.default.connect(env_1.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    // 3. Register routes
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/properties', property_routes_1.default);
    app.use('/api/owner', owner_routes_1.default);
    app.use('/api/saved', saved_routes_1.default);
    app.use('/api/sliders', slider_routes_1.default);
    app.use('/api/sidebar-ads', sidebarAd_routes_1.default);
    app.use('/api/admin', admin_routes_1.default);
    // 4. Global error handler — MUST be last
    app.use(errorMiddleware_1.default);
    // 5. Seed default settings
    await seedSettings();
    // 6. Seed admin user
    await seedAdmin();
    // 7. Start server
    app.listen(Number.parseInt(env_1.env.PORT, 10), () => {
        console.log(`🚀 Server running on http://localhost:${env_1.env.PORT}`);
        console.log(`📦 Environment: ${env_1.env.NODE_ENV}`);
    });
};
/**
 * Seed default platform settings
 */
const seedSettings = async () => {
    await Setting_model_1.default.findOneAndUpdate({ key: 'globalImageLimit' }, {
        $setOnInsert: {
            key: 'globalImageLimit',
            value: 7,
            updatedAt: new Date(),
        },
    }, { upsert: true, new: true });
    console.log('✅ Settings seeded');
};
/**
 * Seed admin user — creates or updates admin account
 */
const seedAdmin = async () => {
    const adminEmail = 'brhomes.app@gmail.com';
    const existingAdmin = await User_model_1.default.findOne({ email: adminEmail });
    if (existingAdmin) {
        console.log('✅ Admin user already exists');
        return;
    }
    {
        const passwordHash = await bcryptjs_1.default.hash('Admin@123', 10);
        await User_model_1.default.create({
            name: 'BR-Homes Admin',
            email: adminEmail,
            passwordHash,
            role: 'admin',
            isActive: true,
            isProfileComplete: true,
            ownerApproved: true,
            emailVerified: new Date(),
            phone: '0000000000',
        });
        // console.log('✅ Admin user created (brhomes.app@gmail.com / Admin@123)')
    }
};
start().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map