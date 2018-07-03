'use strict';

import express from 'express'
import Admin from '../controller/admin/admin'
import Banner from "../controller/admin/banner";
import Check from "../middlewares/check";
import CategoryGoods from "../controller/shopping/categoryGoods";
import Keywords from "../controller/shopping/keyword"
const router = express.Router()

router.post('/login', Admin.login);
// router.post('/register', Admin.register);
router.get('/singout', Admin.singout);
router.get('/all', Admin.getAllAdmin);
router.get('/count', Admin.getAdminCount);
router.get('/info', Admin.getAdminInfo);
router.post('/update/avatar/:admin_id', Admin.updateAvatar);
router.post('/addBanners', Banner.addBanners);
router.get('/v2/banners', Banner.getBanners);
router.get('/v2/banners/count', Banner.getBannersCount);
router.get('/v2/banners/getBannersDetal/:id', Banner.getBannerDetal);
router.delete('/v2/banners/banner/:id',Banner.deleteBanner);
router.post('/v2/banners/updateBanner',Banner.updateBanner);


router.post('/addCategoryGoods', Check.checkAdmin, CategoryGoods.addCategoryGoods);
router.post('/updateCategoryGoods', Check.checkAdmin, CategoryGoods.updateCategoryGoods);
router.delete('/deleteCategoryGoods/:id', Check.checkAdmin, CategoryGoods.deleteCategoryGoods);
router.get('/getCategories', Check.checkAdmin, CategoryGoods.getCategories);


router.post('/addKeywords', Check.checkAdmin, Keywords.addKeywords);
router.post('/updateKeywords', Check.checkAdmin, Keywords.updateKeywords);
router.delete('/deleteKeywords/:keywords_id', Check.checkAdmin, Keywords.deleteKeywords);
router.get('/getKeywords',  Keywords.getKeywords);
router.get('/getKeywordsDetal/:id', Keywords.getKeywordsDetal);
router.get('/getKeywords/count', Keywords.getkeywordsCount);


export default router