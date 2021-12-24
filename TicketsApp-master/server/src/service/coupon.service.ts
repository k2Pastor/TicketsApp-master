import {CouponModel} from "@pavo/shared-services-shared/src/model/coupon.model";
import {CouponRepository} from "../repository/coupon.repository";
import {SecureUserRepository} from "../repository/secure-user.repository";
import {DetailedUserModel, SecureUserModel} from "@pavo/shared-services-shared/src";
import {DetailedUserRepository} from "../repository/detailed-user.repository";

export interface ICouponService {
    getCoupon: (couponId: string) => Promise<CouponModel | null>;
    getAll: () => Promise<CouponModel[]>;
    addCoupon: (coupon: CouponModel, userId: string) => Promise<CouponModel>;
}

export class CouponService implements ICouponService {

    getCoupon(couponId: string): Promise<CouponModel | null> {
        return CouponRepository.findById(couponId)
            .exec();
    }

    getAll(): Promise<CouponModel[]> {
        return CouponRepository.find({})
            .exec();
    }

    addCoupon(coupon: CouponModel, userId: string): Promise<CouponModel> {
        if (!coupon.title) {
            return Promise.reject("title is required");
        }

        if (!coupon.codeWord) {
            return Promise.reject("codeWord is required");
        }

        if (!coupon.coefficient) {
            return Promise.reject("coefficient is required");
        }

        return SecureUserRepository.findById(userId).then((user: SecureUserModel) => {
            return DetailedUserRepository.findOne({"email" : user.email}).then((userProps: DetailedUserModel) => {
                if (userProps.role === "Admin") {
                    const finalCoupon = new CouponRepository(coupon);
                    return finalCoupon.save();
                } else {
                    return Promise.reject("Operation is forbidden!");
                }
            });
        });
    }
}
