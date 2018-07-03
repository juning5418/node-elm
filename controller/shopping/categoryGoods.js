'use strict';

import CategoryGoodsModel from '../../models/shopping/categoryGoods'
import BaseComponent from '../../prototype/baseComponent'
import formidable from "formidable";

class CategoryGoods extends BaseComponent{
	constructor(){
		super()
        this.getCategories = this.getCategories.bind(this);
        this.addCategoryGoods = this.addCategoryGoods.bind(this);
        this.updateCategoryGoods = this.updateCategoryGoods.bind(this);
        this.deleteCategoryGoods = this.deleteCategoryGoods.bind(this);
        this.findChildById = this.findChildById.bind(this);
        this.findById = this.findById.bind(this);
    }
	//获取所有商品分类
	async getCategories(req, res, next){
        const {limit = 0, offset = 0,id=1} = req.query;

        try{
			const categories = await CategoryGoodsModel.find({"$or" : [{"pid":id}, {"sub_categories.pid":id},{"sub_categories.sub_categories.pid":id}]}
			    ).sort({sort: -1}).limit(Number(limit)).skip(Number(offset));
			res.send(categories);
		}catch(err){
			console.log('获取categories失败');
			res.send({
				status: 0,
				type: 'ERROR_DATA',
				message: '获取categories失败'
			})
		}
	}

	async addCategoryGoods(req, res, next){

        let cateId;
        try{
            cateId = await this.getId('category_goods_id');
        }catch(err){
            console.log('获取商店id失败');
            res.send({
                type: 'ERROR_DATA',
                message: '获取数据失败'
            })
            return
        }

        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            try {
                if (!fields.name) {
                    throw new Error('必须填写名称');
                } else if (!fields.pid) {
                    throw new Error('必须填写父id地址');
                }
            } catch (err) {
                console.log('前台参数出错', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return
            }

            const categoryGoods = {

                count: 0,
                id: cateId,
                sort:fields.sort,
                pid:fields.pid,
                image_url: fields.image_url,
                level: fields.level,
                name: fields.name,
                sub_categories:[]
            }

            try{
                if(categoryGoods.pid==1){
                    const cateEntity = await CategoryGoodsModel.create(categoryGoods);
                }else{
                    let CateEntityP = await CategoryGoodsModel.findOne({'id': categoryGoods.pid});
                    // console.log('CateEntityP data', CateEntityP);

                    if(!CateEntityP){
                        throw new Error('必须填写父亲级');
                    }else{
                        const cateEntity = await CategoryGoodsModel.create(categoryGoods);
                        CateEntityP.sub_categories.push(cateEntity);
                        CateEntityP.markModified('sub_categories');
                        await CateEntityP.save();
                        await cateEntity.remove();
                        res.send({
                            status: 1,
                            success: '新增成功',
                        })
                    }
                }

            }catch(err){
                console.log(err);

                console.log('增加category数量失败');
            }
        })

	}



    async updateCategoryGoods(req, res, next){

        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            try {
                if (!fields.name) {
                    throw new Error('必须填写名称');
                } else if (!fields.pid) {
                    throw new Error('必须填写父id地址');
                }
            } catch (err) {
                console.log('前台参数出错', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return
            }

            const {id, pid,  name, sort,level} = fields;


            // const categoryGoods = {
            //
            //     count: 0,
            //     id: fields.id,
            //     pid:fields.pid,
            //     image_url: fields.image_url,
            //     level: fields.level,
            //     name: fields.name,
            //     sub_categories:[]
            // }

            let newData;
            newData ={id, pid,  name, sort,level}
            try{
                if(level==2){

                    const category = await CategoryGoodsModel.findOneAndUpdate({id:pid,"sub_categories.id":id}, {$set: {"sub_categories.$":newData}});

                }else{
                    const category = await CategoryGoodsModel.findOneAndUpdate({id}, {$set: newData});

                }
            }catch(err){
                console.log(err);
                console.log('跟新category数量失败');
            }
        })
    }



    async deleteCategoryGoods(req, res, next){
        const cid = req.params.id;
        if (!cid || !Number(cid) || cid==1 || cid==2 ||cid==3
            || cid==4 || cid==5 ||cid==6
            || cid==7 ) {
            console.log('cid参数错误');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'cid参数错误',
            })
            return
        }
        try{
            const category = await CategoryGoodsModel.findOne({id: cid});
            await category.remove();
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


    async findChildById(id){
        try{
            const CateEntity = await CategoryGoodsModel.findOne({'sub_categories.id': id});
            return CateEntity
        }catch(err){
            console.log('通过category id获取数据失败')
            throw new Error(err)
        }
    }


    async findById(id){
		try{
			const CateEntity = await CategoryGoodsModel.findOne({'sub_categories.id': id});
			let categoName = CateEntity.name;
			CateEntity.sub_categories.forEach(item => {
				if (item.id == id) {
					categoName += '/' + item.name;
				}
			})
			return categoName
		}catch(err){
			console.log('通过category id获取数据失败')
			throw new Error(err)
		}
	}

}

export default new CategoryGoods()