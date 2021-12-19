import {DetailedUserModel} from "./user-details.model";

export interface RegistrationPageModel extends DetailedUserModel{
    password: string;
    submitted: boolean;
    loading: boolean;
    error: string;
}
