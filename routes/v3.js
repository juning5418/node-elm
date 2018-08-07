'use strict';

import express from 'express';
import Pay from '../controller/v3/Pay'
import Explain from '../controller/v3/explain'
import User from "../controller/v2/user";
const router = express.Router();

router.get('/profile/explain', Explain.getExpalin)
router.post('/payAli/:order_id', Pay.payZhifuBao);
router.post('/payWenxin/:order_id', Pay.payWenxin);

export default router