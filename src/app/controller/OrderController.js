const models = require('../models/Models');
const Sequelize = require('../../config/db/index');
const moment = require('moment');

class OrderController {

    // get order/wait
    async waitOrder(req, res) {

        const pageSize = 10;
        const start = 0;
        let page = [];

        if (req.params.page > 0) {
            start = (req.params.page - 1) * pageSize;
        }

        // const countOrder = await models.phieudat.findAll({
        //     raw: true,
        //     attributes: [
        //         [Sequelize.literal('COUNT(DISTINCT(phucvuid))'), 'countOrderWait']
        //     ],
        //     where: {
        //         trangthai: null
        //     },
        // })

        // models.phieudat.findAll({
        //     raw: true,
        //     attributes: [
        //         'phucvuid',
        //         'createdAt',
        //         [Sequelize.fn('count', Sequelize.col('monid')), 'monan'],
        //         [Sequelize.fn('sum', Sequelize.col('soluong')), 'soluong'],
        //       ],
        //     where: {
        //         trangthai: null
        //     },
        //     group: ['phucvuid', 'createdAt'],
        //     order: [['createdAt', 'DESC']],
        // })
        //     .then(result => {
        //         // res.json(result)
        //         for (let i = 0; i < result.length; i++) {
        //             result[i].time = moment(Date.parse(result[i].createdAt)).fromNow();
        //         }
        //         console.log(result[0]);
        //         res.render('order/wait',{order: result})
        //         }
        //     )
        //     .catch(error => console.log(error))

        models.banpv.findAll({
            raw: true,
            attributes: [
                'phucvuid',
            ],
            include: [
                {
                    attributes: ['hoten'],
                    model: models.khachhang
                },
                {
                    attributes: [
                        [Sequelize.fn('count', Sequelize.col('phieudats.monid')), 'monan'],
                        [Sequelize.fn('sum', Sequelize.col('soluong')), 'soluong'],
                        'createdAt',
                    ],
                    model: models.phieudat,
                    order: [['createdAt', 'DESC']],
                    where: {
                        trangthai: null
                    }
                }
            ],
            group: ['phieudats.phucvuid', 'phieudats.createdAt','khachhang.khachhangid','banpv.phucvuid'],
            order: [['phucvuid', 'DESC']]
        })
            .then(result => {
                for (let i = 0; i < result.length; i++) {
                    result[i].time = moment(Date.parse(result[i]['phieudats.createdAt'])).fromNow();
                }
                console.log(result)
                res.render('order/wait', {result})
            })
            .catch(error => {
                console.log('waitting order',error)
            })
    }

    async getDetailOrder(req, res) {

        let nameCustomer;

        await models.khachhang.findAll({
            raw: true,
            attributes: [
                'hoten'
            ],
            include: [
                {
                    model: models.banpv,
                    where: {
                        phucvuid: req.params.id,
                    }
                }
            ]
        })
            .then(result => {
                nameCustomer = result[0].hoten;
            })
            .catch(error => console.log('name Customer: ', error))

        models.phieudat.findAll({
            raw: true,
            attributes: [
                'soluong'
            ],
            include: [{
                raw: true,
                attributes: ['tenmon'],
                model: models.monan,
            }],
            where: {
                phucvuid: req.params.id
            }
        })
            .then(result => {
                let countFood = result.reduce((total, currentValue) => {
                    return total + currentValue.soluong;
                },0)

                let totalfood = result.length;
                res.render('order/detail', {countFood, totalfood, result, nameCustomer})
            })
            .catch(error => console.log('getDetailOrder: ', error))
    }

    async getDetailBill(req, res) {

        let nameCustomer;

        await models.khachhang.findAll({
            raw: true,
            attributes: [
                'hoten'
            ],
            include: [
                {
                    model: models.banpv,
                    where: {
                        phucvuid: req.params.id,
                    }
                }
            ]
        })
            .then(result => {
                nameCustomer = result[0].hoten;
            })
            .catch(error => console.log('name Customer: ', error))

        let status;

        await models.hoadon.findAll({
            raw: true,
            attributes: [
                'trangthai'
            ],
            where: {
                phucvuid: req.params.id
            }
        })
            .then(result => status = !result[0].trangthai)
            .catch(error => console.log('getDetailbill: ', error))

        models.phieudat.findAll({
            raw: true,
            attributes: [
                'soluong'
            ],
            include: [{
                raw: true,
                attributes: ['tenmon', 'dongia'],
                model: models.monan,
            }],
            where: {
                phucvuid: req.params.id
            }
        })
            .then(result => {

                // res.json(result);
                let countFood = result.reduce((total, currentValue) => {
                    return total + currentValue.soluong;
                },0)

                let totalBill = 0;

                for (let i = 0; i < result.length; i++) {
                    result[i].total = result[i].soluong*result[i]['monan.dongia'];
                    totalBill += result[i].total;
                }


                let totalfood = result.length;
                console.log(status)
                res.render('order/billDetail', {countFood, totalfood, result, nameCustomer, totalBill, status, 'phucvuid': req.params.id})
            })
            .catch(error => console.log('getDetailOrder: ', error))
    }

    successOrder (req, res) {
        models.phieudat.update({
            trangthai: true,
        },
        {
            where: {
                phucvuid: req.params.id,
            }
        })
            .then(result => {
                console.log(result);
                res.redirect('/order/wait');
            })
            .catch(error => console.log(error))
    }

    // Get bill success
    successBill(req, res) {
        models.hoadon.update({
            trangthai: 1,
        },
        {
            where: {
                phucvuid: req.params.id,
            }
        })
            .then(result => {
                res.redirect('/revenue/#hoadon')
            })
            .catch(error => {
                console.log('successBill: ', error)
            })
    }
}

module.exports = new OrderController;