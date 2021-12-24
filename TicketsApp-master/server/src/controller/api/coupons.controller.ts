import express, {Request, Response} from "express";
import {auth} from "../../auth/auth";
import {CouponService, ICouponService} from "../../service/coupon.service";
import {CouponModel} from "@pavo/shared-services-shared/src/model/coupon.model";

const router = express.Router();

const couponService: ICouponService = new CouponService();

export class CouponsController {

    getCoupon(req: Request, res: Response): void {
        const couponId = req.params.id;
        couponService.getCoupon(couponId).then((coupon) => {
            if (!coupon) {
                res.status(404).send();
            } else {
                res.send(coupon);
            }
        }, (e) => {
            res.status(500).send(e);
        })
    }

    allCoupons(_req: Request, res: Response): void {
        couponService.getAll().then((coupons) => {
            if (!coupons || !coupons.length) {
                res.status(404).send();
            } else {
                res.send(coupons);
            }
        }, (e) => {
            res.status(500).send(e);
        })
    }

    addCoupon(req: Request, res: Response): void {
        // @ts-ignore
        const { payload: { id } } = req;

        const coupon: CouponModel = ({
            title: req.body.title,
            codeWord: req.body.codeWord,
            coefficient: req.body.coefficient
        });

        couponService.addCoupon(coupon, id).then((coupon) => {
            if (!coupon) {
                res.status(400).send();
            } else {
                res.status(200).send();
            }
        }, (error) => {
            res.status(500).send(error);
        });
    }
}

const controller = new CouponsController();

router.get('/getCoupon/:id', auth.required, controller.getCoupon);
router.get('/allCoupons', auth.required, controller.allCoupons)
router.post('/addCoupon', auth.required, controller.addCoupon);

module.exports = router;
