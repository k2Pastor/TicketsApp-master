import {CredentialsModel} from "./credentials.model";

export interface CouponModel {
    _id?: string;
    title: string;
    codeWord: string;
    coefficient: number;
}

export interface CouponState {
    coupons: CouponModel[];
    credentials: CredentialsModel;
}
