var fs = require('fs');
var fileUpload = require('express-fileupload');

var express = require('express');
var app = express();
app.use(fileUpload());

app.get('/', function(request, response) {
  response.send('running');
});

app.get('/getfile', function(req, res) {
    fs.readFile(__dirname + '/test.js', "utf8", function(err, data) {
        if (err) throw err;
        //res.write(data);
        res.jsonp({ user: data });
        res.end();
    });
})

