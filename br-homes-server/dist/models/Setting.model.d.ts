import mongoose, { Document, Types } from 'mongoose';
export interface ISetting extends Document {
    _id: Types.ObjectId;
    key: string;
    value: unknown;
    updatedBy: Types.ObjectId | null;
    updatedAt: Date;
}
declare const Setting: mongoose.Model<ISetting, {}, {}, {}, mongoose.Document<unknown, {}, ISetting, {}, {}> & ISetting & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Setting;
//# sourceMappingURL=Setting.model.d.ts.map