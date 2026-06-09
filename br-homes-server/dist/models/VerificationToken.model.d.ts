import mongoose, { Document, Types } from 'mongoose';
export interface IVerificationToken extends Document {
    _id: Types.ObjectId;
    email: string;
    hashedToken: string;
    expires: Date;
    createdAt: Date;
}
declare const VerificationToken: mongoose.Model<IVerificationToken, {}, {}, {}, mongoose.Document<unknown, {}, IVerificationToken, {}, {}> & IVerificationToken & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default VerificationToken;
//# sourceMappingURL=VerificationToken.model.d.ts.map