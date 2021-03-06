var express = require('express');
var router = express.Router();
const { Invoice } = require('../Model/invoice');

router.post('/find', async (req, res) => {
    const {pageSize, pageNumber, sortField, sortOrder} = req.body;
    const totalCount = await Invoice.count({});
    const results = await Invoice.find({}).skip(pageNumber * pageSize).limit(pageSize).populate('customer');
    res.send({
        message: 'success',
        items: results,
        totalCount: totalCount
    })
})

router.post('/find/:userid', async (req, res) => {
    const userid = req.params.userid;
    const results = await Invoice.find({customer: userid}).populate('customer');
    res.send({
        message: 'success',
        items: results,
        totalCount: results.length
    })
})

router.get('/:invoiceid', async (req, res) => {
    const invoiceid = req.params.invoiceid;
    const invoice = await Invoice.find({id: invoiceid}).populate('customer');
    res.status(200).send(invoice);
})

router.post('/create', async (req, res) => {
    if(req.body.id == undefined) req.body.id = Math.floor(1000000 + Math.random() * 9000000);
    const invoice = new Invoice(req.body)
        .save((err, response) => {
            if(err) res.status(400).send(err);
            res.status(200).send(response);
        })
})

router.put('/', async (req, res) => {
    const result = await Invoice.findOneAndUpdate({id: req.body.id}, req.body);
    res.status(200).send(result);
})
router.delete('/:invoiceid', (req, res) => {
    const invoiceid = req.params.invoiceid;
    Invoice.findOneAndRemove({'id':invoiceid}, (err, result) => {
        if (err){
            res.status(500).send({
                message: 'error',
                data:err
            });
        }
        return res.status(200).send({
            message: 'success',
            data: result
        })
     });
})

module.exports = router;