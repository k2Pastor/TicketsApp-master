import {Schema, model} from "mongoose"
import {DetailedUserModel} from "@pavo/shared-services-shared/src";

const UserSchema = new Schema<DetailedUserModel> (
    {
        firstName: String,
        lastName: String,
        phone: Number,
        token: String,
        role: String,
        email: String
    }
)

export const DetailedUserRepository = model<DetailedUserModel>('DetailedUser', UserSchema);
