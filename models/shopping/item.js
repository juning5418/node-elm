'use strict';

import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const itemSchema = new Schema({
	auth: {type: Number, default: 0},//审核状态
	rating: {type: Number, default: 0},//级别
	is_featured: {type: Number, default: 0},//特色
	shop_id: {type: Number, isRequired: true},//店铺id
	category_id: {type: Number, isRequired: true},//类型
	pinyin_name: {type: String, default: ''},//拼音
	display_times: {type: Array, default: []},//显示时间
	attrs: {type: Array, default: []},
	description: {type: String, default: ""},//描述
	month_sales: {type: Number, default: 0},//月销售
	rating_count: {type: Number, default: 0},//评论数
	tips: String,
	image_path: String,
	specifications: [Schema.Types.Mixed],//规格
	server_utc: {type: Date, default: Date.now()},
	is_essential: {type: Boolean, default: false},//是否精华
	attributes: {type: Array, default: []},//属性
	item_id: {type: Number, isRequired: true},//
	limitation: Schema.Types.Mixed,//
	name: {type: String, isRequired: true},//
	satisfy_count: {type: Number, default: 0},//好评数
	activity: Schema.Types.Mixed,//活动
	satisfy_rate: {type: Number, default: 0},//
	specfoods: [{
		original_price: {type: Number, default: 0},//
		sku_id: {type: Number, isRequired: true},//
		name: {type: String, isRequired: true},//
		pinyin_name: {type: String, default: ""},//
		shop_id: {type: Number, isRequired: true},//
		packing_fee: {type: Number, default: 0},//
        delivery_fee:{type: Number, default: 0},
		recent_rating: {type: Number, default: 0},//
		promotion_stock: {type: Number, default: -1},//
		price: {type: Number, default: 0},//
		sold_out: {type: Boolean, default: false},//
		recent_popularity: {type: Number, default: 0},//
		is_essential: {type: Boolean, default: false},//
		item_id: {type: Number, isRequired: true},//
		checkout_mode: {type: Number, default: 1},//
		stock: {type: Number, default: 1000},//
		specs_name: String,//规范
		specs: [
			{
				name: String,
				value: String
			}
		]
	}]
})

itemSchema.index({item_id: 1});



const Item = mongoose.model('Item', itemSchema);


export default Item