const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
// const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const keys = require('./config/keys');

const authRoutes = require('./routes/authRoutes');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(express.json());
app.use(
  cookieSession({
    maxAge: 10 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
// app.use(
//   expressSession({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false,
//   })
// );

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

app.get('/api/current_user', (req, res) => {
  console.log('trig', req.user);
  res.send(req.user);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App Up and Running on port : ${PORT}`);
});
