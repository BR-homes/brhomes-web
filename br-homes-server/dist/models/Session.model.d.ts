import mongoose, { Document, Types } from 'mongoose';
export interface ISession extends Document {
    _id: Types.ObjectId;
    sessionToken: string;
    userId: Types.ObjectId;
    expires: Date;
}
declare const Session: mongoose.Model<ISession, {}, {}, {}, mongoose.Document<unknown, {}, ISession, {}, {}> & ISession & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Session;
//# sourceMappingURL=Session.model.d.ts.map