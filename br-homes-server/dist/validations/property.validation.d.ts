import { z } from 'zod';
export declare const createPropertySchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    propertyType: z.ZodEnum<["house", "flat"]>;
    listingType: z.ZodEnum<["sale", "rent"]>;
    bhk: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    areaSqft: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    price: z.ZodNumber;
    city: z.ZodString;
    areaLocality: z.ZodString;
    pincode: z.ZodString;
    contactPhone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    propertyType: "flat" | "house";
    listingType: "sale" | "rent";
    price: number;
    city: string;
    areaLocality: string;
    pincode: string;
    contactPhone: string;
    bhk?: number | null | undefined;
    areaSqft?: number | null | undefined;
}, {
    description: string;
    title: string;
    propertyType: "flat" | "house";
    listingType: "sale" | "rent";
    price: number;
    city: string;
    areaLocality: string;
    pincode: string;
    contactPhone: string;
    bhk?: number | null | undefined;
    areaSqft?: number | null | undefined;
}>, {
    description: string;
    title: string;
    propertyType: "flat" | "house";
    listingType: "sale" | "rent";
    price: number;
    city: string;
    areaLocality: string;
    pincode: string;
    contactPhone: string;
    bhk?: number | null | undefined;
    areaSqft?: number | null | undefined;
}, {
    description: string;
    title: string;
    propertyType: "flat" | "house";
    listingType: "sale" | "rent";
    price: number;
    city: string;
    areaLocality: string;
    pincode: string;
    contactPhone: string;
    bhk?: number | null | undefined;
    areaSqft?: number | null | undefined;
}>;
export declare const updatePropertySchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    propertyType: z.ZodOptional<z.ZodEnum<["house", "flat"]>>;
    listingType: z.ZodOptional<z.ZodEnum<["sale", "rent"]>>;
    bhk: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    areaSqft: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    price: z.ZodOptional<z.ZodNumber>;
    city: z.ZodOptional<z.ZodString>;
    areaLocality: z.ZodOptional<z.ZodString>;
    pincode: z.ZodOptional<z.ZodString>;
    contactPhone: z.ZodOptional<z.ZodString>;
    removeImages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    title?: string | undefined;
    propertyType?: "flat" | "house" | undefined;
    listingType?: "sale" | "rent" | undefined;
    bhk?: number | null | undefined;
    areaSqft?: number | null | undefined;
    price?: number | undefined;
    city?: string | undefined;
    areaLocality?: string | undefined;
    pincode?: string | undefined;
    contactPhone?: string | undefined;
    removeImages?: string[] | undefined;
}, {
    description?: string | undefined;
    title?: string | undefined;
    propertyType?: "flat" | "house" | undefined;
    listingType?: "sale" | "rent" | undefined;
    bhk?: number | null | undefined;
    areaSqft?: number | null | undefined;
    price?: number | undefined;
    city?: string | undefined;
    areaLocality?: string | undefined;
    pincode?: string | undefined;
    contactPhone?: string | undefined;
    removeImages?: string[] | undefined;
}>;
export declare const markPropertySchema: z.ZodObject<{
    status: z.ZodEnum<["sold", "rented"]>;
}, "strip", z.ZodTypeAny, {
    status: "sold" | "rented";
}, {
    status: "sold" | "rented";
}>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type MarkPropertyInput = z.infer<typeof markPropertySchema>;
//# sourceMappingURL=property.validation.d.ts.map