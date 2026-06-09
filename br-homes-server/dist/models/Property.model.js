"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const propertyImageSchema = new mongoose_1.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    cloudinaryPublicId: {
        type: String,
        required: true,
    },
    isPrimary: {
        type: Boolean,
        default: false,
    },
}, { _id: false });
const propertySchema = new mongoose_1.Schema({
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner ID is required'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    propertyType: {
        type: String,
        enum: ['house', 'flat'],
        required: [true, 'Property type is required'],
    },
    listingType: {
        type: String,
        enum: ['sale', 'rent'],
        required: [true, 'Listing type is required'],
    },
    bhk: {
        type: Number,
        default: null,
        min: [1, 'BHK must be between 1 and 5'],
        max: [5, 'BHK must be between 1 and 5'],
    },
    areaSqft: {
        type: Number,
        default: null,
        min: [1, 'Area must be positive'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be non-negative'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
    },
    areaLocality: {
        type: String,
        required: [true, 'Area/Locality is required'],
        trim: true,
    },
    pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        trim: true,
    },
    contactPhone: {
        type: String,
        required: [true, 'Contact phone is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'hidden', 'sold', 'rented'],
        default: 'pending',
    },
    rejectionNote: {
        type: String,
        default: null,
        trim: true,
    },
    images: {
        type: [propertyImageSchema],
        default: [],
    },
}, {
    timestamps: true,
    collection: 'properties',
});
// Compound index for filtered property listing queries
propertySchema.index({
    status: 1,
    city: 1,
    propertyType: 1,
    listingType: 1,
});
const Property = mongoose_1.default.model('Property', propertySchema);
exports.default = Property;
//# sourceMappingURL=Property.model.js.map