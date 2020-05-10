var express = require('express');
var router = express.Router();
const { User } = require('../Model/user');
const { Role } = require('../Model/role');
const { ObjectId } = require('mongodb');

router.post('/findUsers', async (req, res) => {
    const results = await User.find({}).populate('role_id');
    res.send({
        message: 'success',
        items: results,
        totalCount: results.length
    })
})

router.post('/', (req, res) => {
    delete req.body.role_id;
    if(req.body.id == undefined) req.body.id = Math.floor(1000000 + Math.random() * 9000000);
    const user = new User(req.body)
        .save((err, response) => {
            if(err) res.status(400).send(err);
            res.status(200).send(response);
        })
})

module.exports = router;