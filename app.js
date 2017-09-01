/////////////////////////////
////    server side     ////
///////////////////////////
// dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
var app = express();

var favicon = require('serve-favicon')
var methodOverride = require('method-override')
var bodyParser = require('body-parser')
var logger = require('morgan')
var errorHandler = require('errorhandler')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, '/public/favicon.ico')))
app.use(logger('dev'))
app.use(methodOverride())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static(path.join(__dirname, 'public')));




// only route for initial page load
app.get('/', function(req, res) {

    // url used to fetch list of movies
    var url = "https://demo2697834.mockable.io/movies";

    requests(url, function(data) {
        //res.send(data);
        res.render('index', {
            "movies": data
        })
    });
});




// development only
if (app.get('env') === 'development') {
    app.use(errorHandler())
}


function requests(url, callback) {
    // request module is used to process the  url and return the results in JSON format
    request(url, function(err, resp, body) {
        var resultsArray = [];
        body = JSON.parse(body);

        if (!body.entries) {
            results = "No movies found. Try again.";
            callback(results);
        } else {
            results = body.entries;
            for (var i = 0; i < results.length; i++) {
                resultsArray.push({
                    title: results[i].title,
                    images: results[i].images[0].url,
                    contents: results[i].contents[0].url
                });
            };
        };
        // pass back the results to client side
        callback(resultsArray);
    });
};

// run server
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});