"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sidebarAd_controller_1 = require("../controllers/sidebarAd.controller");
const router = (0, express_1.Router)();
// Public: get sidebar ads
router.get('/', sidebarAd_controller_1.getSidebarAds);
exports.default = router;
//# sourceMappingURL=sidebarAd.routes.js.map