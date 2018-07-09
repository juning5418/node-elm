'use strict';

import IndextypeModel from '../../models/v1/indexType'
import BaseComponent from "../../prototype/baseComponent";
import formidable from "formidable";

class Indextype extends BaseComponent{
    constructor(){
        super()
        this.addIndextype = this.addIndextype.bind(this);
        this.getIndextype = this.getIndextype.bind(this);
        this.getIndexTypeDetal = this.getIndexTypeDetal.bind(this);
        this.getIndextypeCount = this.getIndextypeCount.bind(this);
        this.updateIndexType = this.updateIndexType.bind(this);
        this.deleteIndexType = this.deleteIndexType.bind(this);

    }

    async addIndextype(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {sort, image,name} = fields;
            try{
                if(!image){
                    throw new Error('图片地址信息错误');
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


            let indexType_id;
            try{
                indexType_id = await this.getId('indexType_id');
            }catch(err){
                console.log('获取b失败');
                res.send({
                    status: 0,
                    type: 'ERROR_DATA',
                    message: '添加失败'
                })
                return
            }

            try{
                const newIndexType = {
                    id:indexType_id,
                    image,
                    sort,
                    name
                }
                await IndextypeModel.create(newIndexType);
                res.send({
                    status: 1,
                    success: '添加成功'
                })
            }catch(err){
                console.log('添加失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_ADD_BANNER',
                    message: '添加失败'
                })
            }
        })
    }




    async getIndextype(req, res, next){
        const { limit = 20, offset = 0} = req.query;
        try{
            let filter = {};
            const indextype = await IndextypeModel.find(filter, '-_id').sort({sort: -1}).limit(Number(limit)).skip(Number(offset));
            res.send(indextype);
        }catch(err){
            console.log('获取数据失败', err);
            res.send({
                status: 0,
                type: 'GET_DATA_ERROR',
                message: '获取数据失败'
            })
        }
    }


    async getIndexTypeDetal(req, res, next){

        const id = req.params.id;

        if (!id || !Number(id)) {
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误',
            })
            return
        }
        try{
            const indextype = await IndextypeModel.findOne({id: id});
            res.send(indextype)
        }catch(err){
            console.log('获取数据失败', err);
            res.send({
                type: 'ERROR_GET_ADDRESS',
                message: '获取数据失败'
            })
        }


    }



    async getIndextypeCount(req, res, next){
        const id = req.query.id;
        try{
            let filter = {};
            if (id ) {
                filter = {id}
            }

            const count = await IndextypeModel.find(filter).count();
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
    async updateIndexType(req, res, next){
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
            const {id,name, image, sort } = fields;
            try{

                let newData;

                newData = {name,image, sort};
                const indexType = await IndextypeModel.findOneAndUpdate({id}, {$set: newData});

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
    async deleteIndexType(req, res, next){
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
            const indexType = await IndextypeModel.findOne({id: id});

            await indexType.remove()
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

export default new Indextype()