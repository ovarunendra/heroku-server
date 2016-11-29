var http = require('http');
var https = require('https');
var fs = require('fs');
// var Canvas = require('canvas')
//   , Image = Canvas.Image
//   , canvas = new Canvas(200, 200)
//   , ctx = canvas.getContext('2d');
var fileUpload = require('express-fileupload');
// var options = {
//   key: fs.readFileSync('client-key.pem'),
//   cert: fs.readFileSync('client-cert.pem')
// };

var express = require('express');
var app = express();
app.use(fileUpload());

var httpServer = http.createServer(app);
var httpsServer = https.createServer({}, app);
app.get('/getfile', function(req, res) {
    fs.readFile(__dirname + '/test.js', "utf8", function(err, data) {
        if (err) throw err;
        //res.write(data);
        res.jsonp({ user: data });
        res.end();
    });
})
app.get('/files', function(req, res) {
    console.log("files route")
    fs.readFile(__dirname + '/user.png', function(err, data) {
        if (err) throw err;
        var img = new Canvas.Image; // Create a new Image
        img.src = data;

        // Initialiaze a new Canvas with the same dimensions
        // as the image, and get a 2D drawing context for it.
        var canvas = new Canvas(400, 300);

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 400, 300);

        //res.write('<html><body>');
        //res.write('<img src="' + canvas.toDataURL() + '" />');
        //res.write('</body></html>');
        res.write(canvas.toDataURL('image/jpeg', 0.6));
        res.end();
    });
})
app.post('/testUpload', function(req, res) {
    var value = {
        name: "varun"
    }
    console.log("files: ",req.files);
    res.send(value);
});

app.get('/sampleJson', function(req, res){
	var value = {"name": "blippar"};
  res.send(value);
});

app.post('/lookup', function(req, res) {
    var value = {
        name: "varun"
    }
    res.send(value);
})

app.post('/upload', function(req, res) {
    var sampleFile, uploadPath;

    console.log('body', req);
    if (!req.files) {
        console.log('No files were uploaded.');
        res.send('No files were uploaded.');
        return;
    }

    sampleFile = req.files['userfile'];
    uploadPath = __dirname + '/uploadedfiles/' + sampleFile.name;
    sampleFile.mv(uploadPath, function(err) {
        console.log(' files were uploaded.');
        if (err) {
            res.status(500).send(err);
        }
        else {
            fs.readFile(uploadPath, function(err, data) {
                if (err) throw err;
                var img = new Canvas.Image; // Create a new Image
                img.src = data;
                var setWidth = img.width, setHeight = img.height;

                var maxWidth = 400; // Max width for the image
                var maxHeight = 300;    // Max height for the image
                var ratio = 0;  // Used for aspect ratio
                var width = img.width;    // Current image width
                var height = img.height;  // Current image height

                // Check if the current width is larger than the max
                if(width > maxWidth){
                    ratio = maxWidth / width;   // get ratio for scaling image
                    setWidth =  maxWidth; // Set new width
                    setHeight =  height * ratio;  // Scale height based on ratio
                    height = height * ratio;    // Reset height to match scaled image
                    width = width * ratio;    // Reset width to match scaled image
                }

                // Check if current height is larger than max
                if(height > maxHeight){
                    ratio = maxHeight / height; // get ratio for scaling image
                    setHeight = maxHeight;   // Set new height
                    setWidth = width * ratio;    // Scale width based on ratio
                    width = width * ratio;    // Reset width to match scaled image
                }

                // Initialiaze a new Canvas with the same dimensions
                // as the image, and get a 2D drawing context for it.
                var canvas = new Canvas(maxWidth, maxHeight);

                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, setWidth, setHeight);

                //res.write('<html><body>');
                //res.write('<img src="' + canvas.toDataURL() + '" />');
                //res.write('</body></html>');
                canvas.toDataURL('image/jpeg', 1, function(err, jpeg){
                    res.send(jpeg);
                });
                //res.end();
            });
            //res.send('File uploaded!');
        }
    });
});

httpServer.listen(8080, '0.0.0.0');
httpsServer.listen(8443, '0.0.0.0', function() {
    console.log("tets server")
});

