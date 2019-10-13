import dotenv from 'dotenv';
import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import seed from './db/seed';
import dbConnection from './config/db';
import apiRouter from './routes/index';
import usersRouter from './routes/users';
import schema from './schema';
import interviewRoutes from './routes/interviews';
import inviteDevsRoutes from './routes/inviteDevs';
import verifyHirerRoute from './routes/hirer';
dotenv.config();
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../doc.json');

dbConnection.once('open', function() {
  seed();
  console.log('MongoDB database connection established successfully');
});

// Setup Request logging
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

app.use(
  morgan(logFormat, {
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
  morgan(logFormat, {
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
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/interview', interviewRoutes);
app.use('/api/v1/', inviteDevsRoutes);
app.use('/api/v1/hirer', verifyHirerRoute);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  '/graphql',
  graphQLHTTP({
    schema,
    graphiql: true,
  }),
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../', 'client/build')));
  app.get('/*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../', 'client/build/index.html'));
  });
}

// catch 404 and forward to error handler
app.use(function(
  _req: express.Request,
  _res: express.Response,
  next: express.NextFunction,
) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: express.Request, res: express.Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
