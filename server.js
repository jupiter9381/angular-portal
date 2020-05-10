//Install express server
const express = require('express');
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
var cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/'));
app.use(cors());
app.use(function (req, res, next) {
  //set headers to allow cross origin request.
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const MONGOURL = 'mongodb+srv://root:admin123@cluster0-ahfxx.mongodb.net/portal';
mongoose.connect(MONGOURL)
  .then(() => console.log("DB connected"))
  .catch(error => console.log(error));

var userRouter = require('./backend/routes/user');
var roleRouter = require('./backend/routes/role');
app.use('/api/users', userRouter);
app.use('/api/roles', roleRouter);
module.exports = app;
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);