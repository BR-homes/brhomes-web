"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGlobalImageLimitSchema = exports.updateImageLimitSchema = exports.rejectPropertySchema = void 0;
const zod_1 = require("zod");
exports.rejectPropertySchema = zod_1.z.object({
    rejectionNote: zod_1.z
        .string()
        .min(10, 'Rejection note must be at least 10 characters')
        .max(500)
        .trim(),
});
exports.updateImageLimitSchema = zod_1.z.object({
    imageLimit: zod_1.z
        .number()
        .int()
        .min(1, 'Minimum image limit is 1')
        .max(20, 'Maximum image limit is 20'),
});
exports.updateGlobalImageLimitSchema = zod_1.z.object({
    globalImageLimit: zod_1.z
        .number()
        .int()
        .min(1, 'Minimum limit is 1')
        .max(20, 'Maximum limit is 20'),
});
//# sourceMappingURL=admin.validation.js.map