var express = require('express');
var router = express.Router();
var multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Attachment } = require('../Model/attachment');

// file upload settings
const PATH = './uploads';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(!fs.existsSync(PATH)) {
            fs.mkdirSync(PATH)
        }
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.'+file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
})

let upload = multer({
    storage: storage
})

//express settings
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))
router.post('/find/:invoiceid', async (req, res) => {
    const {pageSize, pageNumber, sortField, sortOrder} = req.body;
    const invoiceid = req.params.invoiceid;
    //const totalCount = await Invoice.count({});
    const results = await Attachment.find({}).skip(pageNumber * pageSize).limit(pageSize);
    res.send({
        message: 'success',
        items: results,
        totalCount: results.length
    })
})

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.send({
            success: false
        });
    } else {
        return res.send({
            filename: req.file.filename
        })
    }
});

router.post('/create', async (req, res) => {
    if(req.body.id == undefined) req.body.id = Math.floor(1000000 + Math.random() * 9000000);
    const attachment = new Attachment(req.body)
        .save((err, response) => {
            if(err) res.status(400).send(err);
            res.status(200).send(response);
        })
});

router.post('/update', async (req, res) => {
    const result = await Attachment.findOneAndUpdate({id: req.body.id}, req.body);
    res.status(200).send(result);
});

router.delete('/:attachmentid', (req, res) => {
    const attachmentid = req.params.attachmentid
    Attachment.findOneAndRemove({'id':attachmentid}, (err, result) => {
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