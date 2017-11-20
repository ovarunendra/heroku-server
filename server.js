var express = require('express');
var app = express();
var fs = require('fs');
var morgan = require('morgan');
var zip = require('express-zip');
var cloudinary = require('cloudinary');
var fileUpload = require('express-fileupload');
var aws = require('aws-sdk');
aws.config.loadFromPath('./AwsConfig.json');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var s3 = new aws.S3();

// var s3fsImpl = new s3fs('outfit-image-upload-dev', {
//     accessKeyId: 'AKIAIRT2VF6KTAXZLL5A',
//     secretAccessKey: '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'
// });

var BUCKET_NAME = 'ovarunendra-dev-testing-bucket';
var REGION = 'us-east-2';

function createBucket(bucketName) {
  s3.createBucket({Bucket: bucketName}, function() {
    console.log('created the bucket[' + bucketName + ']');
    console.log(arguments);
  });
} 

function uploadFile(remoteFilename, fileName) {
  var fileBuffer = fs.readFileSync(fileName);
  var metaData = getContentTypeByFile(fileName);
  
  s3.putObject({
    ACL: 'public-read',
    Bucket: BUCKET_NAME,
    Key: remoteFilename,
    Body: fileBuffer,
    ContentType: metaData
  }, function(error, response) {
    console.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + metaData + ']');
    console.log(arguments);
    console.log("https://s3."+REGION+".amazonaws.com/"+BUCKET_NAME+"/"+remoteFilename)
  });
}

function getContentTypeByFile(fileName) {
  var rc = 'application/octet-stream';
  var fileNameLowerCase = fileName.toLowerCase();

  if (fileNameLowerCase.indexOf('.html') >= 0) rc = 'text/html';
  else if (fileNameLowerCase.indexOf('.css') >= 0) rc = 'text/css';
  else if (fileNameLowerCase.indexOf('.json') >= 0) rc = 'application/json';
  else if (fileNameLowerCase.indexOf('.js') >= 0) rc = 'application/x-javascript';
  else if (fileNameLowerCase.indexOf('.png') >= 0) rc = 'image/png';
  else if (fileNameLowerCase.indexOf('.jpg') >= 0) rc = 'image/jpg';

  return rc;
}

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
app.post('/postData', function (req, res) {
  res.jsonp(req.body);
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
  console.log(req.body)
  uploadPath = __dirname + '/uploadedFiles/' + sampleFile.name;
  sampleFile.mv(uploadPath, function (err) {
    if (err) {
        res.status(500).send(err);
    } else {
      res.jsonp({ "msg": "file uplaoded" });
    }
    res.end();
  })
})

app.post('/s3Upload', function(req, res){
  var sampleFile;
  if (!req.files) {
      console.log('No files were uploaded.');
      res.send('No files were uploaded.');
      return;
  }
  sampleFile = req.files['File'];
  // var stream = fs.createReadStream(sampleFile);
  console.log(req.body, req.files);
  // s3fsImpl.writeFile(_file_name, stream).then(function () {
  //     console.log('uploaded ' + sampleFile + ' --> ' + _file_name);
  //     files.splice(0, 1);
  //     saveFile(files, ++index);
  // }, function (reason) {
  //     console.error('unable to upload ' + file);
  //     throw reason;
  // });
  //createBucket('outfit-image-upload-dev')
  uploadFile('dummy.jpg', 'save_screen.jpg');
  res.end();
})

app.get('/userVideo', function (req, res) {
  var query = req.query;
  var filepath = __dirname + '/' +query.name;
  res.sendFile(filepath);
})

app.get('/items', function (req, res) {
  var DATA = [
    { id: 1, text: 'Card #1', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
    { id: 2, text: 'Card #2', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
    { id: 3, text: 'Card #3', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
    { id: 4, text: 'Card #4', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
    { id: 5, text: 'Card #5', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
    { id: 6, text: 'Card #6', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
    { id: 7, text: 'Card #7', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
    { id: 8, text: 'Card #8', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
  ];
  res.jsonp({ "results": DATA });
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
