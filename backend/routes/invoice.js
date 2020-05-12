var express = require('express');
var router = express.Router();
const { Invoice } = require('../Model/invoice');

router.post('/find', async (req, res) => {
    const results = await Invoice.find({});
    res.send({
        message: 'success',
        items: results,
        totalCount: results.length
    })
})

router.get('/:invoiceid', async (req, res) => {
    const invoiceid = req.params.invoiceid;
    const invoice = await Invoice.find({id: invoiceid});
    res.status(200).send(invoice);
})
module.exports = router;