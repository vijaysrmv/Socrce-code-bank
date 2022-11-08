var express = require('express');
var router = express.Router();
var app = express();
app.use(express.static('./'));



// serve angular front end files from root path
router.use('/', express.static('./', { redirect: false }));

// rewrite virtual urls to angular app to enable refreshing of internal pages
router.get('*', function(req, res, next) {
    res.sendFile('./index.html');
    next();
});

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


app.set('port', process.env.PORT || 5000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});