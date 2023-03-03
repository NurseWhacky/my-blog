const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Body parser (reading data from req.body)
// app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(helmet());

app.use(mongoSanitize());

app.use(xss());

// logging
if (process.env.NODE_ENV === 'development') {
  app.use(
    morgan('dev', (tokens, req, res) => {
      [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    })
  );
}

//   Mounting the routes
app.use(`${process.env.BASE_URL_DEV}/posts`, postRouter);
app.use(`${process.env.BASE_URL_DEV}/users`, userRouter);
// console.log(`${process.env.BASE_URL_DEV}/post`);
// app.use(`${process.env.BASE_URL_DEV}/users`, userRouter);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);

  next();
});

app.all('*', (req, res, next) => next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))) 
// if a next() func receives an argument WHATEVER IT IS, express will understand it as an error and will always pass it to the global err handler (see below)

app.use(errorHandler);

// app.all('*', (req, res, next) => {
//   // res.status(404).json({
//   //   status: 'fail',
//   //   message: `Can't find ${req.originalUrl} on this server!`,
//   // });

//   // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
//   // err.status = 'fail';
//   // err.statusCode = 404;

//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // if a next() func receives an argument WHATEVER IT IS, express will understand it as an error and will always pass it to the global err handler (see below)
// });

module.exports = app;
