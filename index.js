var express = require('express');
var path = require('path')
var app = express();

app.use(express.static(path.join(__dirname, '/')));
// app.use(express.static(path.join(__dirname, '/node_modules')));
// app.use(express.static(path.join(__dirname, '/assets')));

app.get('/', function(req, res) {
    res.sendfile('./index.html');
});

app.listen(process.env.PORT || 3000);