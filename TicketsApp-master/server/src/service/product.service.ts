import {ProductRepository} from "../repository/product.repository";
import {DetailedUserModel, ProductModel, SecureUserModel} from "@pavo/shared-services-shared/src";
import {SecureUserRepository} from "../repository/secure-user.repository";
import {DetailedUserRepository} from "../repository/detailed-user.repository";
import {CouponRepository} from "../repository/coupon.repository";
import {CouponModel} from "@pavo/shared-services-shared/src/model/coupon.model";

export interface IProductService {
    getAll: () => Promise<ProductModel[]>;
    getProduct: (productId: string) => Promise<ProductModel>;
    getProductsByCompany: (companyId: string) => Promise<ProductModel[]>;
    addProduct: (product: ProductModel) => Promise<ProductModel>;
    applyCoupon: (productId: string, userId: string, codeWord: string) => Promise<unknown>;
}

export class ProductService implements IProductService {

    getAll(): Promise<ProductModel[]> {
        return ProductRepository.find({})
            .populate('company')
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

    applyCoupon(productId: string, userId: string, codeWord: string): Promise<unknown> {
        return SecureUserRepository.findById(userId).then((user: SecureUserModel) => {
            return DetailedUserRepository.findOne({"email" : user.email}).then((userProps: DetailedUserModel) => {
                if (userProps.role === 'Admin') {
                    return ProductRepository.findById(productId).then((product: ProductModel | null) => {
                        if (product) {
                            return CouponRepository.findOne({"codeWord": codeWord}).then((coupon: CouponModel | null) => {
                                if (coupon) {
                                    const newPrice = product.price * (1 - coupon.coefficient);
                                    return ProductRepository.updateOne({_id: productId}, {$set: {"price": newPrice}})
                                } else {
                                    return Promise.reject("Coupon has not been found in database!");
                                }
                            });
                        } else {
                            return Promise.reject("Product has not been found in database!");
                        }
                    });
                } else {
                    return Promise.reject("Operation is forbidden!");
                }
            });
        });
    }

}
