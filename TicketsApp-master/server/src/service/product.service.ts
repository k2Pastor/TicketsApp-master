import {ProductRepository} from "../repository/product.repository";
import {ProductModel} from "@pavo/shared-services-shared/src";

export interface IProductService {
    getAll: () => Promise<ProductModel[]>;
    addProduct: (product: ProductModel) => Promise<ProductModel>;
}

export class ProductService implements IProductService {

    getAll(): Promise<ProductModel[]> {
        return ProductRepository.find({})
            .exec();
    }

    addProduct(product: ProductModel): Promise<ProductModel> {
        if (!product.title) {
            return Promise.reject("title is required");
        }

        if (!product.description) {
            return Promise.reject("description is required");
        }

        if (!product.price) {
            return Promise.reject("price is required");
        }

        if (!product.participantsAmount) {
            return Promise.reject("participants amount is required");
        }

        const finalProduct = new ProductRepository(product);
        return finalProduct.save();
    }
}
