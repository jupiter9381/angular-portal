var express = require('express');
var router = express.Router();
const { User } = require('../Model/user');
const { Role } = require('../Model/role');

router.get('/', async (req, res) => {
    const results = await User.find({}).populate('role_id');
    res.send({
        message: 'success',
        items: results,
        totalCount: results.length
    })
})

router.get('/:userid', async (req, res) => {
    const userid = req.params.userid;
    const user = await User.find({id: userid});
    res.status(200).send(user);
})

router.post('/findUsers', async (req, res) => {
    const {pageSize, pageNumber, sortField, sortOrder} = req.body;
    const totalCount = await User.count({});
    const results = await User.find({}).skip(pageNumber * pageSize).limit(pageSize).populate('role_id');
    res.send({
        message: 'success',
        items: results,
        totalCount: totalCount
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

router.post('/getUserByToken', async (req, res) => {
    const token = req.body.token;
    const user = await User.findOne({accessToken: token}).populate('role_id');
    res.status(200).send(user);
})
router.post('/login', (req, res) => {
    const {email, password} = req.body;
    User.findOne({email: email, password: password}, (err, user) => {
        if(err) res.response(400).send(err);
        res.status(200).send(user);
    }).populate('role_id');
})

router.delete('/:userid', (req, res) => {
    const userid = req.params.userid;
    User.findOneAndRemove({'id':userid}, (err, result) => {
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

router.post('/update', async (req, res)  => {
    const result = await User.findOneAndUpdate({id: req.body.id}, req.body);
    res.status(200).send(result);
})
module.exports = router;