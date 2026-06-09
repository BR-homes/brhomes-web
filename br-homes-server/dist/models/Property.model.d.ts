import mongoose, { Document, Types } from 'mongoose';
export interface IPropertyImage {
    imageUrl: string;
    cloudinaryPublicId: string;
    isPrimary: boolean;
}
export interface IProperty extends Document {
    _id: Types.ObjectId;
    ownerId: Types.ObjectId;
    title: string;
    description: string;
    propertyType: 'house' | 'flat';
    listingType: 'sale' | 'rent';
    bhk: number | null;
    areaSqft: number | null;
    price: number;
    city: string;
    areaLocality: string;
    pincode: string;
    contactPhone: string;
    status: 'pending' | 'approved' | 'rejected' | 'hidden' | 'sold' | 'rented';
    rejectionNote: string | null;
    images: IPropertyImage[];
    createdAt: Date;
    updatedAt: Date;
}
declare const Property: mongoose.Model<IProperty, {}, {}, {}, mongoose.Document<unknown, {}, IProperty, {}, {}> & IProperty & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Property;
//# sourceMappingURL=Property.model.d.ts.map