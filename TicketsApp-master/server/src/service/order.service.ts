import {OrderRepository} from "../repository/order.repository"
import {DetailedUserRepository} from "../repository/detailed-user.repository";
import {SecureUserRepository} from "../repository/secure-user.repository";
import {DetailedUserModel, SecureUserModel, OrderModel} from "@pavo/shared-services-shared/src";

export interface IOrderService {
    addOrder: (order: OrderModel) => Promise<OrderModel>;
    addParticipant: (userId: string, orderId: string) => Promise<unknown>;
    removeParticipant: (userId: string, orderId: string) => Promise<unknown>;
    getAll: () => Promise<OrderModel[]>;
    getOrder: (orderId: string) => Promise<OrderModel | null>;
    submit: (userId: string, orderId: string) => Promise<unknown>;
    getMyOrders: (userId: string) => Promise<OrderModel[]>;
}

export class OrderService implements IOrderService {

    addOrder(order: OrderModel): Promise<OrderModel> {
        const finalOrder = new OrderRepository(order);
        return finalOrder.save();
    }

    addParticipant(userId: string, orderId: string): Promise<unknown> {
        return SecureUserRepository.findById(userId).then((user: SecureUserModel) => {
            return DetailedUserRepository.findOne({"email" : user.email}).then((userProps: DetailedUserModel) => {
                return OrderRepository.findById(orderId)
                    .populate('product')
                    .exec()
                    .then((order: OrderModel | null) => {
                        if (order && !order.participants?.map(p => p._id).includes(userProps._id)) {
                            if (order.participants.length < order.product.participantsAmount) {
                                return OrderRepository.updateOne({_id: orderId}, {$push: {participants: userProps._id || ''}}).exec();
                            }
                            return Promise.reject("Too many participants!");
                        }
                        return Promise.reject("You are participant already!");
                    });
            });
        });
    }

    removeParticipant(userId: string, orderId: string): Promise<unknown> {
        return SecureUserRepository.findById(userId).then((user: SecureUserModel) => {
            return DetailedUserRepository.find({"email" : user.email}).then((userProps: DetailedUserModel[]) => {
                return OrderRepository.findById(orderId)
                    .exec()
                    .then((order: OrderModel | null) => {
                        if (order?.participants.map(p => p._id).includes(userProps[0]._id)) {
                            return OrderRepository.updateOne({_id: orderId}, {$pull: {participants: userProps[0]._id || ''}}).exec();
                        } else {
                            return Promise.reject("You are not the participant of this order!");
                        }
                    });
            });
        });
    }

    getAll(): Promise<OrderModel[]> {
        return OrderRepository.find({})
            .populate('product')
            .populate('participants')
            .exec();
    }

    getOrder(orderId: string): Promise<OrderModel | null> {
        return OrderRepository.findById(orderId)
            .populate('product')
            .populate('participants')
            .exec();
    }

    getMyOrders(userId: string): Promise<OrderModel[]> {
        return SecureUserRepository.findById(userId).then((user: SecureUserModel) => {
            return DetailedUserRepository.find({"email" : user.email}).then((userProps: DetailedUserModel[]) => {
                return OrderRepository.find({})
                    .exec()
                    .then((orders: OrderModel[] | null) => {
                        if (!orders) {
                            return Promise.reject();
                        } else {
                            return Promise.resolve(orders.filter((o) => o.participants.map(p => p._id).includes(userProps[0]._id)))
                        }
                    });
            });
        });
    }

    submit(userId: string, orderId: string): Promise<unknown> {
        return SecureUserRepository.findById(userId).then((user: SecureUserModel) => {
            return DetailedUserRepository.findOne({"email" : user.email}).then((userProps: DetailedUserModel) => {
                return OrderRepository.findById(orderId)
                    .populate('product')
                    .exec()
                    .then((order: OrderModel | null)=> {
                        if (!order?.isSubmitted) {
                            if (userProps.role === "Admin") {
                                if (order?.participants?.length === order?.product.participantsAmount) {
                                    return OrderRepository.updateOne({_id: orderId}, {$set: {"isSubmitted": true}}).exec();
                                } else {
                                    return Promise.reject("Not enough participants!");
                                }
                            } else {
                                return Promise.reject("Operation is forbidden!");
                            }
                        } else {
                            return Promise.reject("Submit operation is forbidden!");
                        }
                    })
            });
        });
    }
}


