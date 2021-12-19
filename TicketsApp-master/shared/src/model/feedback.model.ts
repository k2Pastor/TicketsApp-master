import {CredentialsModel} from "./credentials.model";

export interface FeedbackModel {
    _id?: string;
    title: string;
    description: string;
    authorId: string;
}

export interface FeedbackState {
    feedbacks: FeedbackModel[];
    credentials: CredentialsModel;
}
