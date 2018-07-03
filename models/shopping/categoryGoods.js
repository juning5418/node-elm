'use strict';

import mongoose from 'mongoose'
import categoryGoodsData from '../../InitData/categoryGoods'

const Schema = mongoose.Schema;

const categoryGoodsSchema = new Schema({
    count: Number,
    id: Number,
    pid:Number,
    image_url: String,
    level: Number,
    name: String,
    sort:Number,
    sub_categories: [
        {
            count: Number,
            id: Number,
            pid:Number,
            image_url: String,
            level: Number,
            name: String,
            sort:Number,
            sub_categories:[]
        },
    ]
});


// categoryGoodsSchema.statics.addCategoryGoods = async function (type){
//     const categoryGoodsName = type.name;
//     try{
//         const allcate = await this.findOne();
//         const subcate = await this.findOne({name: categoryGoodsName[0]});
//         allcate.count ++;
//         subcate.count ++ ;
//         subcate.sub_categories.map(item => {
//             if (item.name == categoryGoodsName[1]) {
//                 return item.count ++
//             }
//         })
//         await allcate.save();
//         await subcate.save();
//         console.log('保存cetegroy成功');
//         return
//     }catch(err){
//         console.log('保存cetegroy失败');
//         throw new Error(err)
//     }
// }



const CategoryGoods = mongoose.model('CategoryGoods', categoryGoodsSchema)

CategoryGoods.findOne((err, data) => {
    if (!data) {
        for (let i = 0; i < categoryGoodsData.length; i++) {
            CategoryGoods.create(categoryGoodsData[i]);
        }
    }
})

export default CategoryGoods