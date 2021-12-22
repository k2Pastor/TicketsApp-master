import {FeedbackModel} from "@pavo/shared-services-shared/src/model/feedback.model";
import {FeedbackRepository} from "../repository/feedback.repository";
import {ProductRepository} from "../repository/product.repository";
import {DetailedUserModel, OrderModel, ProductModel, SecureUserModel} from "@pavo/shared-services-shared/src";
import {SecureUserRepository} from "../repository/secure-user.repository";
import {DetailedUserRepository} from "../repository/detailed-user.repository";
import {OrderRepository} from "../repository/order.repository";

export interface IFeedbackService {
    getFeedback: (feedbackId: string) => Promise<FeedbackModel | null>;
    getMyFeedbacks: (userId: string) => Promise<FeedbackModel[]>;
    getFeedbacksByOrderId: (orderId: string) => Promise<FeedbackModel[]>;
    addFeedback: (feedback: FeedbackModel, orderId: string, userId: string) => Promise<unknown>;
}

export class FeedbackService implements IFeedbackService {

    getFeedback(feedbackId: string): Promise<FeedbackModel | null> {
        return FeedbackRepository.findById(feedbackId)
            .populate("authorId")
            .exec();
    }

    getMyFeedbacks(userId: string): Promise<FeedbackModel[]> {
        return SecureUserRepository.findById(userId).then((user: SecureUserModel) => {
            return DetailedUserRepository.find({"email" : user.email}).then((userProps: DetailedUserModel[]) => {
                return FeedbackRepository.find({})
                    .exec()
                    .then((feedbacks: FeedbackModel[] | null) => {
                        if (!feedbacks) {
                            return Promise.reject();
                        } else {
                            return Promise.resolve(feedbacks.filter((f) => JSON.stringify(f.authorId) === JSON.stringify(userProps[0]._id)));
                        }
                    });
            });
        });
    }

    getFeedbacksByOrderId(orderId: string): Promise<FeedbackModel[]> {
        return OrderRepository.findById(orderId).then((order: OrderModel) => {
            if (order) {
                return ProductRepository.findById(order.product)
                    .populate('feedbacks')
                    .exec()
                    .then((product : ProductModel | null) => {
                        return Promise.resolve(product.feedbacks);
                    });
            } else {
                return Promise.reject("Order has not been found in database!");
            }
        });

    }

    addFeedback(feedback: FeedbackModel, orderId: string, userId: string): Promise<FeedbackModel> {
        if (!feedback.title) {
            return Promise.reject("title is required");
        }

        if (!feedback.description) {
            return Promise.reject("description is required");
        }
        return SecureUserRepository.findById(userId).then((user: SecureUserModel) => {
            return DetailedUserRepository.findOne({"email" : user.email}).then((userProps: DetailedUserModel) => {
                return OrderRepository.findById(orderId)
                    .exec()
                    .then((order: OrderModel | null) => {
                        if (userProps.role === "User") {
                            if (order) {
                                return ProductRepository.findById(order.product)
                                    .exec()
                                    .then((product: ProductModel | null) => {
                                        feedback.authorId = userProps._id;
                                        const finalFeedback = new FeedbackRepository(feedback);
                                        return finalFeedback.save()
                                            .then(() => {
                                                return ProductRepository.updateOne({_id: product._id},
                                                    {$push: {feedbacks: finalFeedback._id || ''}}).exec();
                                            });
                                    });
                            }
                        } else {
                            return Promise.reject("Operation is forbidden!");
                        }
                        return Promise.reject("Order has not been found in database!");
                    });
            });
        });
    }
}
