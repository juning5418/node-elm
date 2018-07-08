'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const cartSchema = Schema({
	id: Number,
	price:Number,
    shopid:Number,
    payments:Number,
    cart: [{
        number:Number,
        image_path:String,
        item_id:String,
        name:String,
        price:Number,
        specs: [
            {
                name: String,
                value: String
            }
        ]
	}],
	status:{type: Number, default: 0},
    user_id:String
})

cartSchema.index({id: 1});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart