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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Feedback'
    }
});

export const FeedbackRepository = model<FeedbackModel>('Feedback', FeedbackSchema);
