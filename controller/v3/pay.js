'use strict';
import AlipaySdk from 'alipay-sdk';
import AlipayFormData from 'alipay-sdk/lib/form';
import fs from 'fs';
import crypto from 'crypto'
import request from 'request';
import xml2js from 'xml2js';
import OrderModel from '../../models/bos/order'

class Pay {



    // 微信：
    // appid：wxeee5551e6501012e
    // 商户id：1503862171
    // buF8847653jYchH72gqhetuowe0j4ang

    constructor() {
        this.payZhifuBao = this.payZhifuBao.bind(this);
        this.payWenxin = this.payWenxin.bind(this);

        this.payZhifuBaoCheck = this.payZhifuBaoCheck.bind(this);

        this.alipaySdk = new AlipaySdk({
            appId: '2018062060400719',
            privateKey: fs.readFileSync('./private-key.pem', 'ascii'),
            alipayPublicKey: fs.readFileSync('./public-key.pem', 'ascii'),
        });

    }


    async payWenxin(req, res, next){
        const order_id = req.params.order_id;
        // console.log("order_id:"+order_id);
        let order;
        try{
            let filter = {id:order_id};
             order = await OrderModel.find(filter, '-_id');
            // console.log(order);
        }catch(err){
            console.log('获取数据失败', err);
            res.send({
                status: 0,
                type: 'GET_DATA_ERROR',
                message: '获取数据失败'
            })
        }



        // let wx = require('weixin-js-sdk');
        let   key = 'buF8847653jYchH72gqhetuowe0j4ang'//注：key为商户平台设置的密钥key
        const md5 = crypto.createHash('md5');

        // let  key = 'buF8847653jYchH72gqhetuowe0j4ang';
        //            timestamp: parseInt(new Date().getTime() / 1000) + '',

        let POSTData = {
            appid: 'wxeee5551e6501012e',
            mch_id: '1503862171',
            nonce_str: Math.random().toString(36).substr(2, 15),
            body: 'liangxin',
            out_trade_no: order.order_id,
            total_fee: order.total_amount*100,
            spbill_create_ip: '115.238.142.218',
            notify_url: 'http://h5.heptalcc.com/notify',
            trade_type: 'NATIVE'
        }

        // var bodyMd5 = md5.update("量心-商品名称").digest('hex').toUpperCase();

        // POSTData.out_trade_no=order_id;

        // POSTData.body = bodyMd5;
        // console.log(raw(data));

        var keys = Object.keys(POSTData);
        keys = keys.sort()
        var newArgs = {};
        keys.forEach(function (key) {
            newArgs[key.toLowerCase()] = POSTData[key];
        });

        var string = '';
        for (var k in newArgs) {
            string += '&' + k + '=' + newArgs[k];
        }
        string = string.substr(1);

        string += '&key=buF8847653jYchH72gqhetuowe0j4ang';

        // console.log(string);

        var sign = md5.update(string,'utf-8').digest('hex').toUpperCase();

        // console.log(sign);

        POSTData.sign = sign;

        var b = new xml2js.Builder();
        var xml = b.buildObject(POSTData);

        // console.log(xml);

        var url="https://api.mch.weixin.qq.com/pay/unifiedorder";
        var requestData=POSTData;
        request({
            url: url,
            method: "POST",
            xml: true,
            headers: {
                "Connection":"Keep-Alive",
                "Content-Type":'application/xml;charset=utf-8',
                "Content-length":xml.length
            },
            body: xml
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {

                // console.log(body) // 请求成功的处理逻辑

                xml2js.parseString(body, function (err, result) {
                    res.send(JSON.stringify(result));

                });


            }
        });




        // fetch("https://api.mch.weixin.qq.com/pay/unifiedorder",POSTData,'POST',function (res) {
        //     // console.log(res)
        //     res.send(res);
        // })


    }




    async payZhifuBao(req, res, next) {



        const order_id = req.params.order_id;
        // console.log("order_id:"+order_id);
        let order;

        try{
            let filter = {id:order_id};
             order = await OrderModel.find(filter, '-_id');
            console.log(order);
        }catch(err){
            console.log('获取数据失败', err);
            res.send({
                status: 0,
                type: 'GET_DATA_ERROR',
                message: '获取数据失败'
            })
        }

        const formData = new AlipayFormData();
        formData.setMethod('get');

        formData.addField('notifyUrl', 'http://h5.heptalcc.com/notify');
        formData.addField('bizContent', {
            outTradeNo: order_id,
            productCode: 'FAST_INSTANT_TRADE_PAY',
            totalAmount: order.total_amount,
            subject: '商品',
            body: '商品详情',
        });

        let result = null;
        let url = "";
        try {

            result = this.alipaySdk.exec(
                'alipay.trade.wap.pay',
                {},
                {formData: formData},
            );
            // console.log(result);


            result.then(function (value) {
                url = value;

                res.send({
                    status: 1,
                    message: 'alipay success',
                    url: url
                });
            });

        } catch (err) {
            console.log("error:" + err);

        }

    }


    async payZhifuBaoCheck(req, res, next) {


        try {

            let ok = this.alipaySdk.checkNotifySign(res);
            let ok2 = this.alipaySdk.checkResponseSign(res);

            console.log("error" + ok);
            console.log("error" + ok2);

        } catch (err) {
            console.log("error:" + err);

        }
    }
}

export default new Pay()