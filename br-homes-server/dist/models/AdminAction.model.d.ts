import mongoose, { Document, Types } from 'mongoose';
export type AdminActionType = 'property_approved' | 'property_rejected' | 'property_hidden' | 'property_unhidden' | 'owner_approved' | 'owner_rejected' | 'user_deactivated' | 'user_reactivated' | 'user_role_changed' | 'image_limit_updated' | 'setting_updated';
export interface IAdminAction extends Document {
    _id: Types.ObjectId;
    adminId: Types.ObjectId;
    targetId: Types.ObjectId;
    targetType: 'property' | 'user';
    action: AdminActionType;
    note: string | null;
    actedAt: Date;
}
declare const AdminAction: mongoose.Model<IAdminAction, {}, {}, {}, mongoose.Document<unknown, {}, IAdminAction, {}, {}> & IAdminAction & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default AdminAction;
//# sourceMappingURL=AdminAction.model.d.ts.map