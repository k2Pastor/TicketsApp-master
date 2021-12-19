import {Schema, model} from "mongoose";
import {CompanyModel} from "@pavo/shared-services-shared/src/model/company.model";

const CompanySchema = new Schema<CompanyModel>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
    }
});

export const CompanyRepository = model<CompanyModel>('Company', CompanySchema);
