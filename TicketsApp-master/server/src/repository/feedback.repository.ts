import {Schema, model} from "mongoose"
import {FeedbackModel} from "@pavo/shared-services-shared/src/model/feedback.model";

const FeedbackSchema = new Schema<FeedbackModel>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'DetailedUser'
    }
});

export const FeedbackRepository = model<FeedbackModel>('Feedback', FeedbackSchema);
