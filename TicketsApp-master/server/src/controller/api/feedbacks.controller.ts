import express, {Request, Response} from "express";
import {FeedbackService, IFeedbackService} from "../../service/feedback.service";
import {auth} from "../../auth/auth";
import {FeedbackModel} from "@pavo/shared-services-shared/src/model/feedback.model";

const router = express.Router();

const feedbackService: IFeedbackService = new FeedbackService();

export class FeedbacksController {

    getFeedback(req: Request, res: Response): void {
        const feedbackId = req.params.id;
        feedbackService.getFeedback(feedbackId).then((feedback) => {
            if (!feedback) {
                res.status(404).send();
            } else {
                res.send(feedback);
            }
        }, (e) => {
            res.status(500).send(e);
        })
    }

    getMyFeedbacks(req: Request, res: Response): void {
        // @ts-ignore
        const { payload: { id } } = req;
        feedbackService.getMyFeedbacks(id).then((feedbacks) => {
            if (!feedbacks || !feedbacks.length) {
                res.status(404).send();
            } else {
                res.send(feedbacks);
            }
        }, (e) => {
            res.status(500).send(e);
        })
    }

    getFeedbacksByOrderId(req: Request, res: Response): void {
        const orderId = req.params.id;
        feedbackService.getFeedbacksByOrderId(orderId).then((feedbacks) => {
            if (!feedbacks || !feedbacks.length) {
                res.status(404).send();
            } else {
                res.send(feedbacks);
            }
        }, (e) => {
            res.status(500).send(e);
        })
    }

    addFeedback(req: Request, res: Response): void {
        // @ts-ignore
        const { payload: { id } } = req;
        const orderId = req.body.orderId;
        const feedback: FeedbackModel = {
            title: req.body.title,
            description: req.body.description,
            authorId: null
        }
        feedbackService.addFeedback(feedback, orderId, id).then((feedback) => {
            if (!feedback) {
                res.status(400).send();
            } else {
                res.status(200).send();
            }
        }, (error) => {
            res.status(500).send(error);
        });
    }
}

const controller = new FeedbacksController();

router.get('/getFeedback/:id', auth.required, controller.getFeedback);
router.get('/getMyFeedbacks', auth.required, controller.getMyFeedbacks);
router.get('/getFeedbacksByOrderId/:id', auth.required, controller.getFeedbacksByOrderId);
router.post('/addFeedback', auth.required, controller.addFeedback);

module.exports = router;
