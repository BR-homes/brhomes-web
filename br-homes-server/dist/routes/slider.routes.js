"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const slider_controller_1 = require("../controllers/slider.controller");
const router = (0, express_1.Router)();
// Public: get slider images
router.get('/', slider_controller_1.getSliderImages);
exports.default = router;
//# sourceMappingURL=slider.routes.js.map