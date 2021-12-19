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

    addProduct(req: Request, res: Response): void {
        const product: ProductModel = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            participantsAmount: req.body.participantsAmount,
            fileName: req.body.fileName,
            feedbacks: []
        }
        productService.addProduct(product).then((product) => {
            res.json(product);
        })
    }
}

const controller = new ProductsController();

router.get('/allProducts', auth.required, controller.getAll)

router.post('/addProduct', auth.required, controller.addProduct)

module.exports = router;
