var express = require('express');
var app = express();
var fs = require('fs');
var zip = require('express-zip');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.send('running');
  response.end();
});

app.get('/getfile', function(req, res) {
    fs.readFile(__dirname + '/test.js', "utf8", function(err, data) {
        if (err) throw err;
        //res.write(data);
        res.jsonp({ data: data });
        res.end();
    });
})

app.get('/getassets', function(req, res) {
    var filePath = __dirname + '/Floor.md2';
    res.sendFile(filePath)
})

app.get('/getzip', function(req, res){
    // res.zip([
    //     { path: 'blipp_icon.png', name: 'blipp_icon.png' },
    //     { path: 'blippar_background.png', name: 'blippar_background.png' }
    //   ]);
    res.sendFile(__dirname + '/assets.zip');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

