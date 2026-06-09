import mongoose, { Document } from 'mongoose';
export interface ISliderImage extends Document {
    imageUrl: string;
    cloudinaryPublicId: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<ISliderImage, {}, {}, {}, mongoose.Document<unknown, {}, ISliderImage, {}, {}> & ISliderImage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=SliderImage.model.d.ts.map