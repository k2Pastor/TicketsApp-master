import express, {Request, Response} from "express";
import {CompanyService, ICompanyService} from "../../service/company.service";
import {auth} from "../../auth/auth";
import {CompanyModel} from "@pavo/shared-services-shared/src/model/company.model";

const router = express.Router();

const companyService: ICompanyService = new CompanyService();

export class CompaniesController {

    addCompany(req: Request, res: Response): void {
        const company: CompanyModel = ({
            title: req.body.title,
            description: req.body.description,
            fileName: req.body.fileName
        });

        companyService.addCompany(company).then((company) => {
            if (!company) {
                res.status(400).send();
            } else {
                res.status(200).send();
            }
        }, (error) => {
            res.status(500).send(error);
        });
    }

    getCompany(req: Request, res: Response): void {
        const companyId = req.params.id;
        companyService.getCompany(companyId).then((company) => {
            if (!company) {
                res.status(404).send();
            } else {
                res.send(company);
            }
        }, (e) => {
            res.status(500).send(e);
        })
    }

    allCompanies(_req: Request, res: Response): void {
        companyService.getAll().then((companies) => {
            if (!companies || !companies.length) {
                res.status(404).send();
            } else {
                res.send(companies);
            }
        }, (e) => {
            res.status(500).send(e);
        })
    }
}

const controller = new CompaniesController();

router.get('/getCompany/:id', auth.required, controller.getCompany);
router.get('/allCompanies', auth.required, controller.allCompanies);
router.post('/addCompany', auth.required, controller.addCompany);

module.exports = router;
