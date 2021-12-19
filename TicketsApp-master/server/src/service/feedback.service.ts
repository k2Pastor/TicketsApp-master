import {FeedbackModel} from "@pavo/shared-services-shared/src/model/feedback.model";
import {FeedbackRepository} from "../repository/feedback.repository";
import {ProductRepository} from "../repository/product.repository";
import {ProductModel} from "@pavo/shared-services-shared/src";

export interface IFeedbackService {
    getFeedback: (feedbackId: string) => Promise<FeedbackModel | null>;
    addFeedback: (feedback: FeedbackModel, productId: string) => Promise<unknown>;
}

export class FeedbackService implements IFeedbackService {

    getFeedback(feedbackId: string): Promise<FeedbackModel | null> {
        return FeedbackRepository.findById(feedbackId).exec();
    }

    addFeedback(feedback: FeedbackModel, productId: string): Promise<FeedbackModel> {
        if (!feedback.title) {
            return Promise.reject("title is required");
        }

        if (!feedback.description) {
            return Promise.reject("description is required");
        }

        return ProductRepository.findById(productId)
            .exec()
            .then((product: ProductModel | null) => {
                if (product) {
                    const finalFeedback = new FeedbackRepository(feedback);
                    return finalFeedback.save()
                        .then(() => {
                            return ProductRepository.updateOne({_id: productId}, {$push: {feedbacks: finalFeedback._id || ''}}).exec();
                        });
                }
                return Promise.reject("Product has not been found in database!");
            });
    }
}
