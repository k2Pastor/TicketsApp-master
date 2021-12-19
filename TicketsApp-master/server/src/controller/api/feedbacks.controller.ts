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

    addFeedback(req: Request, res: Response): void {
        // // @ts-ignore
        // const { payload: { id } } = req;
        const productId = req.body.productId;
        const feedback: FeedbackModel = {
            title: req.body.title,
            description: req.body.description,
            author: req.body.authorId
        }
        feedbackService.addFeedback(feedback, productId).then((feedback) => {
           res.json(feedback);
        });
    }
}

const controller = new FeedbacksController();

router.get('/getFeedback', auth.optional, controller.getFeedback);
router.post('/addFeedback', auth.optional, controller.addFeedback);

module.exports = router;
