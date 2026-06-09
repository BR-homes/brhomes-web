"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionGuard_1 = __importDefault(require("../middleware/sessionGuard"));
const roleGuard_1 = __importDefault(require("../middleware/roleGuard"));
const owner_controller_1 = require("../controllers/owner.controller");
const router = (0, express_1.Router)();
router.use(sessionGuard_1.default, (0, roleGuard_1.default)('owner'));
router.get('/properties', owner_controller_1.getOwnerProperties);
router.get('/stats', owner_controller_1.getOwnerStats);
exports.default = router;
//# sourceMappingURL=owner.routes.js.map