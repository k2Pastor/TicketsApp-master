import {FeedbackModel} from "@pavo/shared-services-shared/src/model/feedback.model";
import {FeedbackRepository} from "../repository/feedback.repository";
import {ProductRepository} from "../repository/product.repository";
import {DetailedUserModel, ProductModel, SecureUserModel} from "@pavo/shared-services-shared/src";
import {SecureUserRepository} from "../repository/secure-user.repository";
import {DetailedUserRepository} from "../repository/detailed-user.repository";

export interface IFeedbackService {
    getFeedback: (feedbackId: string) => Promise<FeedbackModel | null>;
    getMyFeedbacks: (userId: string) => Promise<FeedbackModel[]>;
    addFeedback: (feedback: FeedbackModel, productId: string, userId: string) => Promise<unknown>;
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

    addFeedback(feedback: FeedbackModel, productId: string, userId: string): Promise<FeedbackModel> {
        if (!feedback.title) {
            return Promise.reject("title is required");
        }

        if (!feedback.description) {
            return Promise.reject("description is required");
        }
        return SecureUserRepository.findById(userId).then((user: SecureUserModel) => {
            return DetailedUserRepository.findOne({"email" : user.email}).then((userProps: DetailedUserModel) => {
                return ProductRepository.findById(productId)
                    .exec()
                    .then((product: ProductModel | null) => {
                        if (userProps.role === "User") {
                            if (product) {
                                feedback.authorId = userProps._id;
                                const finalFeedback = new FeedbackRepository(feedback);
                                return finalFeedback.save()
                                    .then(() => {
                                        return ProductRepository.updateOne({_id: productId}, {$push: {feedbacks: finalFeedback._id || ''}}).exec();
                                    });
                            }
                        } else {
                            return Promise.reject("Operation is forbidden!");
                        }
                        return Promise.reject("Product has not been found in database!");
                    });
            });
        });
    }
}
