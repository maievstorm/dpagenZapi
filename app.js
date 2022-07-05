var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var checksongRouter=require('./routes/checksongroutes');
var invoiceRouter = require('./routes/invoiceroutes');
var master_crawlRouter = require('./routes/master_crawlroutes');
var subscriptionRouter=require('./routes/subscriptionroutes');
var useraccountRouter = require('./routes/useraccountroutes');
var requestsubRoute  = require('./routes/requestsubroutes'); 
var offerRouter = require("./routes/offerroutes");
var productRouter = require('./routes/product');
var checksongRouter=require('./routes/checksongroutes');
var invoiceRouter = require('./routes/invoiceroutes');
var includeRouter = require('./routes/includeroutes');
var optionRouter = require('./routes/optionroutes');
var optionincludeRouter = require('./routes/optionincludedroutes');
var usergroupRouter = require('./routes/usergrouproutes');
var usergrouptypeRouter = require('./routes/usergrouptyperoutes');
var ingroupRouter=require('./routes/ingrouproutes');
var planRouter=require('./routes/planroutes');
var planhistoryRouter=require('./routes/planhistoryroutes');
var prerequisiteRouter=require('./routes/prerequisiteroutes');
var softwareRouter=require('./routes/softwareroutes');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  origin: ['http://localhost:3000', 'https://dpaportal.apps.xplat.fis.com.vn']
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/checksong', checksongRouter);
app.use('/api/v1/invoice', invoiceRouter);
app.use('/api/v1/include', includeRouter);
app.use('/api/v1/mastercrawl',master_crawlRouter);
app.use('/api/v1/useraccount',useraccountRouter);
app.use('/api/v1/subscription',subscriptionRouter);
app.use('/api/v1/requestsub',requestsubRoute);
app.use('/api/v1/offer', offerRouter);
app.use('/api/v1/option', optionRouter);
app.use('/api/v1/optionincluded',optionincludeRouter);
app.use('/api/v1/usergroup',usergroupRouter);
app.use('/api/v1/usergrouptype',usergrouptypeRouter);
app.use('/api/v1/ingroup',ingroupRouter);
app.use('/api/v1/plan',planRouter);
app.use('/api/v1/planhistory',planhistoryRouter);
app.use('/api/v1/prerequisite',prerequisiteRouter);
app.use('/api/v1/software',softwareRouter)


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
  res.send(err.message);
});

module.exports = app;