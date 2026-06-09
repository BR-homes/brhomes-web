"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionGuard_1 = __importDefault(require("../middleware/sessionGuard"));
const roleGuard_1 = __importDefault(require("../middleware/roleGuard"));
const admin_controller_1 = require("../controllers/admin.controller");
const multer_1 = __importDefault(require("multer"));
const slider_controller_1 = require("../controllers/slider.controller");
const sidebarAd_controller_1 = require("../controllers/sidebarAd.controller");
const router = (0, express_1.Router)();
// All admin routes require session + admin role
router.use(sessionGuard_1.default, (0, roleGuard_1.default)('admin'));
// Dashboard
router.get('/stats', admin_controller_1.getStats);
// Owner management
router.get('/owners/pending', admin_controller_1.getPendingOwners);
router.put('/owners/:id/approve', admin_controller_1.approveOwner);
// Property management
router.get('/properties/pending', admin_controller_1.getPendingProperties);
router.put('/properties/:id/approve', admin_controller_1.approveProperty);
router.put('/properties/:id/reject', admin_controller_1.rejectProperty);
router.get('/properties', admin_controller_1.getAllProperties);
router.delete('/properties/:id', admin_controller_1.adminDeleteProperty);
// User management
router.get('/users', admin_controller_1.getAllUsers);
router.patch('/users/:id/deactivate', admin_controller_1.toggleUserActive);
// Settings
router.get('/settings', admin_controller_1.getSettings);
router.put('/settings/image-limit', admin_controller_1.updateGlobalImageLimit);
router.put('/users/:id/image-limit', admin_controller_1.updateUserImageLimit);
// Slider images (admin)
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
router.post('/sliders', upload.array('images', 10), slider_controller_1.uploadSliderImages);
router.delete('/sliders/:id', slider_controller_1.deleteSliderImage);
// Sidebar ads (admin)
const uploadVideo = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
router.post('/sidebar-ads', uploadVideo.array('images', 10), sidebarAd_controller_1.uploadSidebarAds);
router.delete('/sidebar-ads/:id', sidebarAd_controller_1.deleteSidebarAd);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map