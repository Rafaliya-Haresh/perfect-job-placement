var path = require('path'),
    http = require('http'),
    config = require('config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart(),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    multiparty = require('multiparty'),
    expressValidator = require('express-validator'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    routes = require('./app/routes/routes'),
    cookieSession = require('cookie-session');


var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./localStorage');


var app = module.exports = express();

if(!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

var env = process.env.NODE_ENV || 'development';


var vNumber = process.env.cachesVersion;
if(localStorage.getItem('cachesVersionNo')) {
    vNumber = localStorage.getItem('cachesVersionNo');
}


process.env.cachesVersion = ''+ (parseInt(vNumber) + 1);

localStorage.setItem('cachesVersionNo', process.env.cachesVersion);




// connect mongDB
//mongoose.connect(config.get('mongoDBURI'));

mongoose.connect('mongodb://heroku_xxgmmxtk:fh9nvalplv0u5h8r7821vcdnmq@ds225902.mlab.com:25902/heroku_xxgmmxtk', function(err) {
	if (err) {
		console.log('===================Could not connect to MongoDB!');
	}
});

require('./config/passport')(passport);

app.locals.ENV = env;

// ExpressJS Configuration
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json({limit:'100mb'}));
app.use(cookieParser());
app.use(methodOverride());

app.use(cookieSession({
  name: 'session',
  keys: ['d88d8d8d898d89d89d989d889x98x89x89x8989898898a8a8a8a8a8a8a'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


app.use(flash());

app.use(function(req, res, next) {
    if(req.session && req.session.user) {
        req.user = req.session.user;
        req.session.user = req.user;
    }
    next();
});


if(process.env.NODE_ENV == 'developement') {
    app.use(express.static(path.join(__dirname, 'public')));
} else {
    app.use(express.static(path.join(__dirname, 'public'), {
        maxAge: '7d'
    }));
}

app.use('/', routes);



/**
 * Server connection..
 */
var server = http.createServer(app);

server.listen(process.env.PORT, function() {
	console.log("Express server listening on port " + process.env.PORT);
});


// var ibRegisterModules = [
//     'board',
//     'estimation',
//     'organization',
//     'teamroom'
// ];


// var tt = require('./app/modules/card/init');
// tt.init(app, oSocket);


// for (var dr in ibRegisterModules) {
//     var tt1 = require('./app/modules/' + ibRegisterModules[dr] + '/init');
//         tt1.init(app, oSocket);
// }
