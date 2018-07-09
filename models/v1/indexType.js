'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const indexTypeSchema = new Schema({
	id: Number,
	sort: Number,
	image: String,
	name:String,
})

indexTypeSchema.index({id: 1});

const IndexType = mongoose.model('IndexType', indexTypeSchema);

export default IndexType