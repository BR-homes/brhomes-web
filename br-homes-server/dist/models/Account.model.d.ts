import mongoose, { Document, Types } from 'mongoose';
export interface IAccount extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    type: string;
    provider: string;
    providerAccountId: string;
    access_token: string | null;
    refresh_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
}
declare const Account: mongoose.Model<IAccount, {}, {}, {}, mongoose.Document<unknown, {}, IAccount, {}, {}> & IAccount & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Account;
//# sourceMappingURL=Account.model.d.ts.map