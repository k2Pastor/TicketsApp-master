import {SecureUserModel} from "@pavo/shared-services-shared/src";

export interface SecureUserDao extends SecureUserModel {
    setPassword: (password: string) => void;
}
