"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const sessionGuard_1 = __importDefault(require("../middleware/sessionGuard"));
const roleGuard_1 = __importDefault(require("../middleware/roleGuard"));
const ownerApprovedGuard_1 = __importDefault(require("../middleware/ownerApprovedGuard"));
const imageLimitGuard_1 = __importDefault(require("../middleware/imageLimitGuard"));
const optionalSessionGuard_1 = __importDefault(require("../middleware/optionalSessionGuard"));
const property_controller_1 = require("../controllers/property.controller");
const router = (0, express_1.Router)();
// Multer config — memory storage, 5MB limit, max 10 files
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 10 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    },
});
// Public routes
router.get('/', optionalSessionGuard_1.default, property_controller_1.getProperties);
router.get('/:id', optionalSessionGuard_1.default, property_controller_1.getPropertyById);
// Owner routes
router.post('/', sessionGuard_1.default, (0, roleGuard_1.default)('owner'), ownerApprovedGuard_1.default, imageLimitGuard_1.default, upload.array('images', 10), property_controller_1.createProperty);
router.put('/:id', sessionGuard_1.default, (0, roleGuard_1.default)('owner'), imageLimitGuard_1.default, upload.array('images', 10), property_controller_1.updateProperty);
router.patch('/:id/hide', sessionGuard_1.default, (0, roleGuard_1.default)('owner'), property_controller_1.toggleHideProperty);
router.patch('/:id/mark', sessionGuard_1.default, (0, roleGuard_1.default)('owner'), property_controller_1.markProperty);
router.delete('/:id', sessionGuard_1.default, (0, roleGuard_1.default)('owner'), property_controller_1.deleteProperty);
exports.default = router;
//# sourceMappingURL=property.routes.js.map