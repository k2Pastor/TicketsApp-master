import {CredentialsModel} from "./credentials.model";
import {FeedbackModel} from "./feedback.model";

export interface ProductModel {
    _id?: string;
    title: string;
    description: string;
    price: number;
    participantsAmount: number;
    fileName?: string;
    feedbacks: FeedbackModel[];
}

export interface ProductsState {
    products: ProductModel[];
    credentials: CredentialsModel;
}
