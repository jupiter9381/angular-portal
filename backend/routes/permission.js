var express = require('express');
var router = express.Router();
const { Permission } = require('../Model/permission');

router.get('/', async (req, res) => {
    const results = await Permission.find({});
    res.send({
        message: 'success',
        items: results,
        totalCount: results.length
    })
})

module.exports = router;