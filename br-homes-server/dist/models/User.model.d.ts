import mongoose, { Document, Types } from 'mongoose';
export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    passwordHash: string | null;
    phone: string | null;
    role: 'buyer' | 'owner' | 'admin';
    isActive: boolean;
    isProfileComplete: boolean;
    ownerApproved: boolean;
    imageLimit: number | null;
    createdAt: Date;
    updatedAt: Date;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.model.d.ts.map