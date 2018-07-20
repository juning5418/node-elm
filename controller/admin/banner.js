'use strict';

import BannerModel from '../../models/v1/banner'
import BaseComponent from "../../prototype/baseComponent";
import formidable from "formidable";
import AddressModel from "../../models/v1/address";

class Banner extends BaseComponent{
    constructor(){
        super()
        this.addBanners = this.addBanners.bind(this);
        this.getBanners = this.getBanners.bind(this);
        this.getBannerDetal = this.getBannerDetal.bind(this);
        this.getBannersCount = this.getBannersCount.bind(this);
        this.updateBanner = this.updateBanner.bind(this);
        this.deleteBanner = this.deleteBanner.bind(this);
        this.authBanners = this.authBanners.bind(this);
    }

    async addBanners(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {url, image,name,sort} = fields;
            try{
                if(!url){
                    throw new Error('地址信息错误');
                }else if(!image){
                    throw new Error('图片地址信息错误');
                }else if(!name){
                    throw new Error('信息错误');
                }
            }catch(err){
                console.log(err.message);
                res.send({
                    status: 0,
                    type: 'GET_WRONG_PARAM',
                    message: err.message
                })
                return
            }


            let banner_id;
            let auth = 0;
            try{
                banner_id = await this.getId('banner_id');
            }catch(err){
                console.log('获取banner_id失败');
                res.send({
                    status: 0,
                    type: 'ERROR_DATA',
                    message: '添加失败'
                })
                return
            }

            try{
                const newBanner = {
                    id:banner_id,
                    banner_id,
                    image,
                    url,
                    name,
                    sort,
                    auth
                }
                await BannerModel.create(newBanner);
                res.send({
                    status: 1,
                    success: '添加banner成功'
                })
            }catch(err){
                console.log('添加banner失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_ADD_BANNER',
                    message: '添加banner失败'
                })
            }
        })
    }

    async authBanners(req, res, next) {

        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log('获取商品信息form出错', err);
                res.send({
                    status: 0,
                    type: 'ERROR_FORM',
                    message: '表单信息错误',
                })
                return
            }
            const {id,auth } = fields;
            try{

                let newData;

                newData = {auth};
                const banner = await BannerModel.findOneAndUpdate({id}, {$set: newData});

                res.send({
                    status: 1,
                    success: '操作成功',
                })
            }catch(err){
                console.log(err.message, err);
                res.send({
                    status: 0,
                    type: 'ERROR_UPDATE_FOOD',
                    message: '操作失败',
                })
            }
        })

    }


    async getBanners(req, res, next){
        const { limit = 20, offset = 0} = req.query;
        try{
            let filter = {};
            const banners = await BannerModel.find(filter, '-_id').sort({id: -1}).limit(Number(limit)).skip(Number(offset));
            res.send(banners);
        }catch(err){
            console.log('获取banner数据失败', err);
            res.send({
                status: 0,
                type: 'GET_DATA_ERROR',
                message: '获取banner数据失败'
            })
        }
    }


    async getBannerDetal(req, res, next){

        const id = req.params.id;

        if (!id || !Number(id)) {
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误',
            })
            return
        }
        try{
            const banner = await BannerModel.findOne({id: id});
            res.send(banner)
        }catch(err){
            console.log('获取banner数据失败', err);
            res.send({
                type: 'ERROR_GET_ADDRESS',
                message: '获取banner数据失败'
            })
        }


    }



    async getBannersCount(req, res, next){
        const id = req.query.id;
        try{
            let filter = {};
            if (id ) {
                filter = {id}
            }

            const count = await BannerModel.find(filter).count();
            res.send({
                status: 1,
                count,
            })
        }catch(err){
            console.log('获取banner数量失败', err);
            res.send({
                status: 0,
                type: 'ERROR_TO_GET_COUNT',
                message: '获取banner数量失败'
            })
        }
    }
    async updateBanner(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log('获取商品信息form出错', err);
                res.send({
                    status: 0,
                    type: 'ERROR_FORM',
                    message: '表单信息错误',
                })
                return
            }
            const {id,name, image, url,sort } = fields;
            try{
                if (!name) {
                    throw new Error('名称错误');
                }else if(!image ){
                    throw new Error('图片错误');
                }else if(!url ){
                    throw new Error('链接错误');
                }
                let newData;

                newData = {name,image, url,sort};
                const banner = await BannerModel.findOneAndUpdate({id}, {$set: newData});

                res.send({
                    status: 1,
                    success: '修改信息成功',
                })
            }catch(err){
                console.log(err.message, err);
                res.send({
                    status: 0,
                    type: 'ERROR_UPDATE_FOOD',
                    message: '更新信息失败',
                })
            }
        })
    }
    async deleteBanner(req, res, next){
        const id = req.params.id;
        if (!id ) {
            console.log('id参数错误');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'id参数错误',
            })
            return
        }
        try{
            const banner = await BannerModel.findOne({id: id});

            await banner.remove()
            res.send({
                status: 1,
                success: '删除成功',
            })
        }catch(err){
            console.log('删除失败', err);
            res.send({
                status: 0,
                type: 'DELETE_FOOD_FAILED',
                message: '删除失败',
            })
        }
    }


}

export default new Banner()