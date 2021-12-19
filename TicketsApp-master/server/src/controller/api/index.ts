import express from "express";

const router = express.Router();

router.use('/login', require('./login'))
router.use('/user', require('./user.controller'))
router.use('/orders', require('./orders.controller'))
router.use('/products', require('./products.controller'))
router.use('/upload', require('./upload.controller'))
router.use('/feedbacks', require('./feedbacks.controller'))
router.use('/companies', require('./companies.controller'))

module.exports = router;
