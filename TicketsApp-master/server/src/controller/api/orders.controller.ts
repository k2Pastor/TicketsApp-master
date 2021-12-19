import express, {Request, Response} from "express";

const router = express.Router();

import {auth} from "../../auth/auth";
import {IOrderService, OrderService} from "../../service/order.service";
import {OrderModel} from "@pavo/shared-services-shared/src";

const orderService: IOrderService = new OrderService();

// stub
export class OrderController {
    addOrder(req: Request, res: Response): void {
        const order: OrderModel = ({
            participants: [],
            product: req.body.product,
            isSubmitted: false
        })
        orderService.addOrder(order).then((order) => {
            if (!order) {
                res.status(400).send();
            } else {
                res.status(200).send();
            }
        }, (error) => {
            res.status(500).send(error);
        });
    }

    addParticipant(req: Request, res: Response): void {
        // @ts-ignore
        const { payload: { id } } = req;
        const orderId = req.body.orderId;

        orderService.addParticipant(id, orderId).then(() => {
            res.status(200).send();
        }, (e) => {
            res.status(500).send(e);
        });
    }

    removeParticipant(req: Request, res: Response): void {
        // @ts-ignore
        const { payload: { id } } = req;
        const orderId = req.body.orderId;

        orderService.removeParticipant(id, orderId).then(() => {
            res.status(200).send();
        }, (e) => {
            res.status(500).send(e);
        });
    }

    allOrders(_req: Request, res: Response): void {
        orderService.getAll().then((orders) => {
            if (!orders || !orders.length) {
                res.status(404).send();
            } else {
                res.send(orders);
            }
        }, (e) => {
            res.status(500).send(e);
        })
    }

    getOrder(req: Request, res: Response): void {
        const orderId = req.params.id;
        orderService.getOrder(orderId).then((order) => {
            if (!order) {
                res.status(404).send();
            } else {
                res.send(order);
            }
        }, (e) => {
            res.status(500).send(e);
        })
    }

    submit(req: Request, res: Response): void {
        // @ts-ignore
        const { payload: { id } } = req;
        const orderId = req.body.orderId;
        orderService.submit(id, orderId).then(() => {
            res.status(200).send();
        }, (e) => {
            res.status(500).send(e);
        })
    }
}

const orderController = new OrderController();

router.post('/addOrder', auth.required, orderController.addOrder)

router.put('/addParticipant', auth.required, orderController.addParticipant)

router.put('/removeParticipant', auth.required, orderController.removeParticipant)

router.get('/allOrders', auth.optional, orderController.allOrders)

router.get('/getOrder/:id', auth.optional, orderController.getOrder)

router.put('/submit', auth.required, orderController.submit)

module.exports = router;
