'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const keywordsSchema = new Schema({

    id:Number,
    name:String
});

keywordsSchema.index({id: 1})

const Keywords = mongoose.model('Keywords', keywordsSchema)

export default Keywords