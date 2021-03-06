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

router.post('/update', async (req, res) => {
    const result = await Role.findOneAndUpdate({id: req.body.id}, req.body);
    res.status(200).send(result);
})

router.delete('/:roleid', (req, res) => {
    const roleid = req.params.roleid;
    Role.findOneAndRemove({'id':roleid}, (err, result) => {
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