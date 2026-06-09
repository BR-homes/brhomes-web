import mongoose, { Document, Types } from 'mongoose';
export interface ISavedProperty extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    propertyId: Types.ObjectId;
    savedAt: Date;
}
declare const SavedProperty: mongoose.Model<ISavedProperty, {}, {}, {}, mongoose.Document<unknown, {}, ISavedProperty, {}, {}> & ISavedProperty & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default SavedProperty;
//# sourceMappingURL=SavedProperty.model.d.ts.map