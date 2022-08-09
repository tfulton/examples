// const process = require('process');
// const envs = require('envs');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*******************************************/
/************ INITIALIZE OAUTH /************/
/******************************************/
const config = require('config');
app.use(session((
  {
    secret: config.get('env.sandbox.sessionInfo.secret'),
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: config.get('env.sandbox.sessionInfo.maxAge')}
}
)));

/******************************************/
/***************** ROUTES/*****************/
/******************************************/

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
// app.set('environment', envs('NODE_TLS_REJECT_UNAUTHORIZED', '0'));

// const index = require('./routes/index');
// app.use('/', index);

const auth = require('./routes/auth');
app.use('/auth', auth);

const ordersV2 = require('./routes/orders_v2');
app.use('/v2/orders', ordersV2);

// const paymentsV1 = require('./routes/payments_v1');
// app.use('/v1/payments', paymentsV1);

// const paymentsV2 = require('./routes/payments_v2');
// app.use('/v2/payments', paymentsV2);

// const beam = require('./routes/beam');
// app.use('/beam', beam);

// const nvp = require('./routes/nvp');
// app.use('/nvp', nvp);

const token = require('./routes/token');
app.use('/token', token);

/*****************************************/
/***************** OTHER *****************/
/******************************************/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
