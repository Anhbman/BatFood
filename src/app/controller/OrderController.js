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

        models.phieudat.findAll({
            raw: true,
            attributes: [
                'phucvuid',
                'createdAt',
                [Sequelize.fn('count', Sequelize.col('monid')), 'monan'],
                [Sequelize.fn('sum', Sequelize.col('soluong')), 'soluong'],
              ],
            where: {
                trangthai: null
            },
            group: ['phucvuid', 'createdAt'],
            order: [['createdAt', 'DESC']],
        })
            .then(result => {
                // res.json(result)
                for (let i = 0; i < result.length; i++) {
                    result[i].time = moment(Date.parse(result[i].createdAt)).fromNow();
                }
                console.log(result[0]);
                res.render('order/wait',{order: result})
                }
            )
            .catch(error => console.log(error))
    }

    async getDetailOrder(req, res) {
        
    }
}

module.exports = new OrderController;