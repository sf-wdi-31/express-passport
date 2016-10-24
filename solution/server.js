// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// We'll serve jQuery and bootstrap from a local bower cache avoiding CDNs
// We're placing these under /vendor to differentiate them from our own assets
app.use('/vendor', express.static(__dirname + '/bower_components'));


// START @AUTH
// sessions!
var expressSession = require('express-session');
sessionOptions = {
  secret: 'I am not so secret.',
  resave: false,
  saveUninitialized: false
}
app.use(expressSession(sessionOptions));

// passport
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
// END @AUTH


var controllers = require('./controllers');


/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', controllers.api.index);

// START @AUTH
app.post('/api/users', controllers.users.create);
// app.get('/api/users/:userId', controllers.users.show);
// app.post('/login', controller.users.login); // could use sessions controller
app.get('/logout', controllers.users.logout);  // could use sessions controller
// END @AUTH

app.get('/api/albums', controllers.albums.index);
app.get('/api/albums/:albumId', controllers.albums.show);
app.post('/api/albums', controllers.albums.create);
app.delete('/api/albums/:albumId', controllers.albums.destroy);
app.put('/api/albums/:albumId', controllers.albums.update);

app.get('/api/albums/:albumId/songs', controllers.albumsSongs.index);
app.post('/api/albums/:albumId/songs', controllers.albumsSongs.create);
app.delete('/api/albums/:albumId/songs/:songId', controllers.albumsSongs.destroy);
app.put('/api/albums/:albumId/songs/:songId', controllers.albumsSongs.update);


/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
