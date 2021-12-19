import {Schema, model} from "mongoose"
import {OrderModel} from "@pavo/shared-services-shared/src";

const OrderSchema = new Schema<OrderModel>({
    product : {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: "DetailedUser"
    }],
    isSubmitted: {
        type: Boolean
    }
});


export interface IOrderRepository {

}

export const OrderRepository = model<OrderModel>('Order', OrderSchema);
