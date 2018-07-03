'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const bannerSchema = new Schema({
	id: Number,
	url: String,
	image: String,
	name:String,
	banner_id:{type: Number, isRequired: true}
})

bannerSchema.index({id: 1});

const Banners = mongoose.model('Banners', bannerSchema);

export default Banners