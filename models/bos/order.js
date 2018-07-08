'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const orderSchema = new Schema({
	order_time: Number,
	pay_time:Number,
	id: Number,
	cart_id:Number,
	restaurant_id: Number,
	status_code: {type: Number, default: 0},
	total_amount: Number,
	user_id: Number,
	address_id: Number,
    payments:String,
    image_path:String,
    name:String


})

orderSchema.index({id: 1});

const Order = mongoose.model('Order', orderSchema);

export default Order