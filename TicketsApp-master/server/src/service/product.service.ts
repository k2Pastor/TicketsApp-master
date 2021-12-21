import {ProductRepository} from "../repository/product.repository";
import {ProductModel} from "@pavo/shared-services-shared/src";

export interface IProductService {
    getAll: () => Promise<ProductModel[]>;
    getProduct: (productId: string) => Promise<ProductModel>;
    getProductsByCompany: (companyId: string) => Promise<ProductModel[]>;
    addProduct: (product: ProductModel) => Promise<ProductModel>;
}

export class ProductService implements IProductService {

    getAll(): Promise<ProductModel[]> {
        return ProductRepository.find({}).populate('company')
            .exec();
    }

    getProduct(productId: string): Promise<ProductModel> {
        return ProductRepository.findById(productId)
            .populate('feedbacks')
            .populate('company')
            .exec();
    }

    getProductsByCompany(companyId: string): Promise<ProductModel[]> {
        return ProductRepository.find({})
            .exec()
            .then((products: ProductModel[] | null) => {
               if (!products) {
                   return Promise.reject();
               } else {
                   return Promise.resolve(products.filter((p) => JSON.stringify(p?.company?._id) === JSON.stringify(companyId)))
               }
            });
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
