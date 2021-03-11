//TODO: Possible help page for connecting to Ignition.

const path = require('path');
const http = require('http');
require('dotenv').config();
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const socketio = require('socket.io');
const flash = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('./config/passport')(passport);
const plcnextAPI = require('./pxc_modules/plcnextAPI');
const PORT = 3010 || process.env.PORT;
const server = http.createServer(app);
const io = socketio(server);

//Data Logging
const timestamp = require('time-stamp');
const logger = require('winston');
const logFormat = logger.format.printf(({level, message}) => {
  myTimeStamp = timestamp('MM/DD/YYYY HH:mm:ss');
  return `${level.toUpperCase()} ${myTimeStamp} ${message}`;
});
logger.configure({
    level: process.env.LOG_LEVEL || "info",
    format: logFormat,
    transports: [
        new logger.transports.Console({
            stderrLevels: ['error']
        })
    ]
});

//Server configs
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false })); //New body parser to get data from forms via req.body
app.use(cookieParser());
app.use(session(
  {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  }
));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Web socket
io.on('connection', socket => {
  socket.emit('welcomeMessage', 'Welcome to the Phoenix Contact Node Web Kit for PLCnext!');

  setInterval(() => {
    if(global.location !== '/'){
      socket.emit('apiConnection', plcnextAPI.isAvailable);
    }

    if(global.location === '/dashboard'){
      socket.emit('data', plcnextAPI);
    }
  }, 1000)
});

//Routes
app.use('/', require('./routes/login'));
app.use('/', require('./routes/dashboard'));
app.use('/', require('./routes/change-pass'));
app.use('/', require('./routes/logout'));

//Error Handler
app.use((err, req, res, next) => {
  res.json(err);
});

//Start Server
server.listen(PORT, () => {
  logger.info(`Web server listening on port ${PORT}.`);
});
