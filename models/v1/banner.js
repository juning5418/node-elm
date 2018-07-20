'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const bannerSchema = new Schema({
	id: Number,
	url: String,
	image: String,
	name:String,
    auth: {type: Number, default: 0},//审核状态
	sort:Number,
	banner_id:{type: Number, isRequired: true}
})

bannerSchema.index({id: 1});

const Banners = mongoose.model('Banners', bannerSchema);

export default Banners