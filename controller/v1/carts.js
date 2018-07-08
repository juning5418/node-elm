'use strict';

import formidable from 'formidable'
import PaymentsModel from '../../models/v1/payments'
import CartModel from '../../models/v1/cart'
import BaseComponent from "../../prototype/baseComponent";
import OrderModel from '../../models/bos/order'

class Carts extends BaseComponent{
	constructor(){
        super();
		this.checkout = this.checkout.bind(this);
	}
	async checkout(req, res, next){
		const UID = req.session.user_id;
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {

			const {come_from,entities,payments,shopid,type} = fields;

			let cart_id;
			let order_id;
			try{
				cart_id = await this.getId('cart_id');
                order_id = await this.getId('order_id');

            }catch(err){
				console.log('获取数据数据失败', err);
				res.send({
					status: 0,
					type: 'ERROR_DATA',
					message: '操作失败',
				})
				return 
			}
			let total = 0; //价格
			let image_path ;
            let payName = "" ;

            console.log(shopid);

            for(var i = 0 ;i < entities.length ; i++){
            	var item = entities[i];
                image_path = item.image_path;
                payName = payName + "-" + item.name
                total += item.price * item.number;
            }

			const checkoutInfo = {
				id: cart_id,
				price:total,
                shopid:shopid,
				cart: entities,
				payments,
                status:type,
				user_id:UID
			}



            const timeNow = new Date().getTime();

            const orderInfo = {
                id: order_id,
                order_time:timeNow,
                pay_time:0,
                cart_id:cart_id,
                restaurant_id:shopid,
                total_amount:total,
                payments,
                status_code:type,
                user_id:UID,
                address_id:null,
                image_path:image_path,
                name:payName
            }

            // console.log(checkoutInfo);

            if(total==0){
                res.send({
                    status: 0,
                    type: 'ERROR_TO_SAVE_CART',
                    message: '加入失败'
                })
			}else{
                try{
                    const newCart = new CartModel(checkoutInfo);
                    const newOrder = new OrderModel(orderInfo);
                    const order = await newOrder.save();
                    const cart = await newCart.save();
                    res.send(cart)
                }catch(err){
                    console.log('保存数据失败');
                    res.send({
                        status: 0,
                        type: 'ERROR_TO_SAVE_CART',
                        message: '加入失败'
                    })
                }
			}

		})
	}
}

export default new Carts()