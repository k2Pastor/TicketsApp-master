import {CouponModel} from "@pavo/shared-services-shared/src/model/coupon.model";
import {model, Schema} from "mongoose";

const CouponSchema = new Schema<CouponModel> ({
    title: {
        type: String,
        required: true
    },
    codeWord: {
        type: String,
        required: true
    },
    coefficient: {
        type: Number,
        required: true
    }
});

export const CouponRepository = model<CouponModel>('Coupon', CouponSchema);
