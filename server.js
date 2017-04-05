var express = require('express');
var app = express();
var fs = require('fs');
var morgan = require('morgan');
var zip = require('express-zip');
var cloudinary = require('cloudinary');
var fileUpload = require('express-fileupload');
cloudinary.config({
  cloud_name: 'cloud016',
  api_key: '489187727225319',
  api_secret: 'lpKRPtNFaVByYDaD-JWqe4HoRb4'
});
cloudinary.uploader.upload(__dirname + '/Blippar_FINAL.mp4', function(result) {
  // Upload handler
  console.log('result: ', result);
}, {
  public_id: 'Blippar_FINAL',
  resource_type: 'video'
});
app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname + '/public'));
app.use(morgan('combined'));
app.use(fileUpload());
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.send('up and running!');
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
app.get('/getVideo', function(req, res) {
    var path = __dirname + '/Blippar_FINAL.mp4';
    //res.send(cloudinary.video('Blippar_FINAL'));
    res.sendFile(path);
})

app.get('/getassets', function(req, res) {
  var query = req.query;
  var products = query.product;
  var response = [];
  products.forEach(function (product) {
    response.push({path: product, name: product})
  });
  res.zip(response);
  // res.setHeader('Cache-Control', 'public, max-age=31557600');
  //   res.zip([
  //   { path: 'fighther_launch.mp3', name: 'fighther_launch.mp3' },
  //   { path: 'theme_song.mp3', name: 'theme_song.mp3' },
  //   { path: 'tpath_1.md2', name: 'tpath_1.md2' },
  //   { path: 'tpath_2.md2', name: 'tpath_2.md2' },
  //   { path: 'tpath_3.md2', name: 'tpath_3.md2' },
  //   { path: 'blippar_background.png', name: 'blippar_background.png' },
  //   { path: 'tpath_0.md2', name: 'tpath_0.md2' },
  //   { path: 'fighter_texture_A.jpg', name: 'fighter_texture_A.jpg' },
  //   { path: 'fighter.md2', name: 'fighter.md2' },
  //   { path: 'fighter_texture.jpg', name: 'fighter_texture.jpg' }
  // ]);
})

app.get('/getCategory', function (req, res) {
  var query = req.query;
  fs.readFile(__dirname + '/data.json', "utf8", function(err, data) {
      if (err) throw err;
      var jsonData = JSON.parse(data);
      var output = [];
      jsonData[query["markerName"]].category.forEach(function(value, index){
        output.push({
          "name": value.name,
          "id": value.id
        })
      })
      res.jsonp(output);
      res.end();
  });

})

app.get('/getSymptoms', function (req, res) {
  var query = req.query;
  fs.readFile(__dirname + '/data.json', "utf8", function(err, data) {
      if (err) throw err;
      var jsonData = JSON.parse(data);
      var output = [];
      jsonData[query["markerName"]].category.forEach(function(value, index){
        if (value.id == query["id"]) {
          value.symptoms.forEach(function (v, i) {
            output.push({
              "name": v.name,
              "id": v.id
            })
          })
        }
      })
      res.jsonp(output);
      res.end();
  });

})

app.get('/getProducts', function (req, res) {
  var query = req.query;
  fs.readFile(__dirname + '/data.json', "utf8", function(err, data) {
      if (err) throw err;
      var jsonData = JSON.parse(data);
      var output = [];
      jsonData[query["markerName"]].category.forEach(function(value, index){
        if (value.id == query["id"]) {
          value.symptoms.forEach(function (v, i) {
            if (v.id == query["sid"]) {
              output = output.concat(v.products)
            }

          })
        }
      })
      res.jsonp(output);
      res.end();
  });

})
app.get('/image', function (req, res) {
  var query = req.query;
  var filepath = __dirname + '/' +query.name;
  res.sendFile(filepath);

})
app.get('/redirect302', function (req, res) {
  res.writeHead(302, {
    'Location': '/sampleData'
  });
  res.end();
})
app.get('/redirect307', function (req, res) {
  res.writeHead(307, {
    'Location': '/sampleData'
  });
  res.end();
})
app.get('/sampleData', function (req, res) {
  res.jsonp({"data": "redirect data"});
  res.end();
})
app.post('/upload', function(req, res) {
  var sampleFile, uploadPath;
  if (!req.files) {
      console.log('No files were uploaded.');
      res.send('No files were uploaded.');
      return;
  }
  sampleFile = req.files['File'];
  uploadPath = __dirname + '/' + sampleFile.name;
  sampleFile.mv(uploadPath, function (err) {
    if (err) {
        res.status(500).send(err);
    }
    res.end();
  })
})
app.get('/userVideo', function (req, res) {
  var query = req.query;
  var filepath = __dirname + '/' +query.name;
  res.sendFile(filepath);
})
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
