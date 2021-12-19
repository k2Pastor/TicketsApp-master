import {CredentialsModel} from "./credentials.model";

export interface CompanyModel {
    _id?: string;
    title: string;
    description: string;
}

export interface CompanyState {
    companies: CompanyModel[];
    credentials: CredentialsModel;
}
