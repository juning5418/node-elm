'use strict';

import KeywordsModel from '../../models/shopping/keywords'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import {Food as FoodModel, Menu as MenuModel} from "../../models/shopping/food";
import BannerModel from "../../models/v1/banner";

class Keywords extends BaseComponent{
	constructor(){
		super();
        this.addKeywords = this.addKeywords.bind(this);

	}

    async getKeywords(req, res, next){
        const {limit = 20, offset = 0} = req.query;

        try{
            let filter = {};
            const keywordsList = await KeywordsModel.find(filter, '-_id').limit(Number(limit)).skip(Number(offset));
            res.send(keywordsList)
        }catch(err){
            console.log('获取关键字失败', err);
            res.send({
                type: 'ERROR_GET_ADDRESS',
                message: '获取关键字列表失败'
            })
        }
    }


    async addKeywords(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {name} = fields;
            try{
                if (!name) {
                    throw new Error('数据错误');
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

            let key_id;
            try{
                key_id = await this.getId('keywords_id');
            }catch(err){
                console.log('获取keywords_id失败');
                res.send({
                    status: 0,
                    type: 'ERROR_DATA',
                    message: '添加失败'
                })
                return
            }

            try{
                const newData = {
                    id:key_id,
                    name
                }
                await KeywordsModel.create(newData);
                res.send({
                    status: 1,
                    success: '添加成功'
                })
            }catch(err){
                console.log('添加失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_ADD_ADDRESS',
                    message: '添加失败'
                })
            }
        })
    }
    async updateKeywords(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log('获取信息form出错', err);
                res.send({
                    status: 0,
                    type: 'ERROR_FORM',
                    message: '表单信息错误',
                })
                return
            }
            const {name,id} = fields;
            try{
                if (!name) {
                    throw new Error('名称错误');
                }
                let newData;

                newData = {name};
                const keywords = await KeywordsModel.findOneAndUpdate({id}, {$set: newData});

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


    async deleteKeywords(req, res, next){
        const keywords_id = req.params.keywords_id;
        if (!keywords_id || !Number(keywords_id)) {
            console.log('keywords_id参数错误');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'keywords_id参数错误',
            })
            return
        }
        try{
            const keywords = await KeywordsModel.findOne({id: keywords_id});
            await keywords.remove();
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


    async getkeywordsCount(req, res, next){
        const id = req.query.id;
        try{
            let filter = {};
            if (id ) {
                filter = {id}
            }

            const count = await KeywordsModel.find(filter).count();
            res.send({
                status: 1,
                count,
            })
        }catch(err){
            console.log('获取数量失败', err);
            res.send({
                status: 0,
                type: 'ERROR_TO_GET_COUNT',
                message: '获取数量失败'
            })
        }
    }


    async getKeywordsDetal(req, res, next){

        const id = req.params.id;

        if (!id || !Number(id)) {
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误',
            })
            return
        }
        try{
            const keywords = await KeywordsModel.findOne({id: id});
            res.send(keywords)
        }catch(err){
            console.log('获取数据失败', err);
            res.send({
                type: 'ERROR_GET_ADDRESS',
                message: '获取数据失败'
            })
        }


    }


}

export default new Keywords()