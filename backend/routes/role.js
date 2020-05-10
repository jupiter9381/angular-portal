var express = require('express');
var router = express.Router();
const { Role } = require('../Model/role');


router.get('/', async (req, res) => {
    const results = await Role.find({});
    res.send({
        message: 'success',
        items: results,
        totalCount: results.length
    })
})

router.post('/findRoles', async (req, res) => {
    const results = await Role.find({});
    res.send({
        message: 'success',
        items: results,
        totalCount: results.length
    })
})

router.post('/create', async (req, res) => {
    if(req.body.id == undefined) req.body.id = Math.floor(1000000 + Math.random() * 9000000);
    const role = new Role(req.body)
        .save((err, response) => {
            if(err) res.status(400).send(err);
            res.status(200).send(response);
        })
})
module.exports = router;