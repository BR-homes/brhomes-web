"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionGuard_1 = __importDefault(require("../middleware/sessionGuard"));
const roleGuard_1 = __importDefault(require("../middleware/roleGuard"));
const saved_controller_1 = require("../controllers/saved.controller");
const router = (0, express_1.Router)();
// Allow both buyers and owners to save properties
router.use(sessionGuard_1.default, (0, roleGuard_1.default)('buyer', 'owner'));
router.get('/', saved_controller_1.getSavedProperties);
router.post('/:propertyId', saved_controller_1.saveProperty);
router.delete('/:propertyId', saved_controller_1.unsaveProperty);
exports.default = router;
//# sourceMappingURL=saved.routes.js.map