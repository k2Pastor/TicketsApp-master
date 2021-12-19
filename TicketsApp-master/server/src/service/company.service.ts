import {CompanyModel} from "@pavo/shared-services-shared/src/model/company.model";
import {CompanyRepository} from "../repository/company.repository";

export interface ICompanyService {
    getCompany: (companyId: string) => Promise<CompanyModel | null>;
    getAll: () => Promise<CompanyModel[]>;
    addCompany: (company: CompanyModel) => Promise<CompanyModel>;
}

export class CompanyService implements ICompanyService {

    getCompany(companyId: string): Promise<CompanyModel | null> {
        return CompanyRepository.findById(companyId)
            .exec();
    }

    getAll(): Promise<CompanyModel[]> {
        return CompanyRepository.find({})
            .exec();
    }

    addCompany(company: CompanyModel): Promise<CompanyModel> {
        const finalCompany = new CompanyRepository(company);
        return finalCompany.save();
    }
}
