import mongoose, { Document } from 'mongoose';
export interface ISidebarAd extends Document {
    videoUrl: string;
    cloudinaryPublicId: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<ISidebarAd, {}, {}, {}, mongoose.Document<unknown, {}, ISidebarAd, {}, {}> & ISidebarAd & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=SidebarAd.model.d.ts.map