'use strict';
exports.__esModule = true;
var http_errors_1 = require('http-errors');
var express_1 = require('express');
var cors_1 = require('cors');
var compression_1 = require('compression');
var morgan_1 = require('morgan');
var express_graphql_1 = require('express-graphql');
var path_1 = require('path');
var mongoose_1 = require('mongoose');
var index_1 = require('./routes/index');
var schema_1 = require('./schema');
var app = express_1['default']();
// Setup Request logging
var logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan_1['default'](logFormat, {
    skip: function(_req, res) {
      if (process.env.NODE_ENV === 'test') {
        return true;
      }
      return res.statusCode < 400;
    },
    stream: process.stderr,
  }),
);
app.use(
  morgan_1['default'](logFormat, {
    skip: function(_req, res) {
      if (process.env.NODE_ENV === 'test') {
        return true;
      }
      return res.statusCode >= 400;
    },
    stream: process.stdout,
  }),
);
app.disable('x-powered-by');
app.use(compression_1['default']());
app.use(cors_1['default']());
app.use(express_1['default'].json());
app.use(express_1['default'].urlencoded({ extended: false }));
app.use('/api', index_1['default']);
mongoose_1['default'].connect(
  'mongodb://localhost:27017/test',
  { useNewUrlParser: true },
  function() {
    console.log('Database connected succesfully');
  },
);
var connection = mongoose_1['default'].connection;
connection.once('open', function() {
  console.log('MongoDB database connection established successfully');
});
app.use(
  '/graphql',
  express_graphql_1['default']({
    schema: schema_1['default'],
    graphiql: true,
  }),
);
if (process.env.NODE_ENV === 'production') {
  app.use(
    express_1['default'].static(
      path_1['default'].join(__dirname, '../', 'client/build'),
    ),
  );
  app.get('/*', function(_req, res) {
    res.sendFile(
      path_1['default'].join(__dirname, '../', 'client/build/index.html'),
    );
  });
}
// catch 404 and forward to error handler
app.use(function(_req, _res, next) {
  next(http_errors_1['default'](404));
});
// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
exports['default'] = app;
