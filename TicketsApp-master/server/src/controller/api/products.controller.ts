import express, {Request, Response} from "express";
import {auth} from "../../auth/auth";
import {IProductService, ProductService} from "../../service/product.service";
import {ProductModel} from "@pavo/shared-services-shared/src";

const router = express.Router();

const productService: IProductService = new ProductService();

export class ProductsController {
    getAll(_req: Request, res: Response): void {
        productService.getAll().then((products) => {
            if (!products || !products.length) {
                res.status(404).send();
            } else {
                res.send(products);
            }
        })
    }

    getProduct(req: Request, res: Response): void {
        const productId = req.params.id;
        productService.getProduct(productId).then((product) => {
            if (!product) {
                res.status(404).send();
            } else {
                res.send(product);
            }
        }, (e) => {
            res.status(500).send(e);
        })
    }

    getProductsByCompany(req: Request, res: Response): void {
        const companyId = req.params.id;
        productService.getProductsByCompany(companyId).then((products) => {
            if (!products || !products.length) {
                res.status(404).send();
            } else {
                res.send(products);
            }
        })
    }

    addProduct(req: Request, res: Response): void {
        const product: ProductModel = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            participantsAmount: req.body.participantsAmount,
            fileName: req.body.fileName,
            feedbacks: [],
            company: req.body.company
        }
        productService.addProduct(product).then((product) => {
            if (!product) {
                res.status(400).send();
            } else {
                res.status(200).send();
            }
        }, (error) => {
            res.status(500).send(error);
        })
    }
}

const controller = new ProductsController();

router.get('/allProducts', auth.required, controller.getAll)

router.get('/getProduct/:id', auth.required, controller.getProduct)

router.get('/getProductsByCompany/:id', auth.required, controller.getProductsByCompany)

router.post('/addProduct', auth.required, controller.addProduct)

module.exports = router;
