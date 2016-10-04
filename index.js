var gzippo = require('gzippo');
var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname ,'/assets')));
app.listen(process.env.PORT || 3000);