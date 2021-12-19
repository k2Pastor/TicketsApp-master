import {Schema, model} from "mongoose"
import {ProductModel} from "@pavo/shared-services-shared/src";

const ProductSchema = new Schema<ProductModel>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    participantsAmount: {
        type: Number,
        required: true
    },
    fileName: {
        type: String,
    },
    feedbacks: [{
        type: Schema.Types.ObjectId,
        ref: 'Feedback'
    }]
});

export interface IProductRepository {

}

export const ProductRepository = model('Product', ProductSchema);

