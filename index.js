const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cors = require('cors');
const path = require('path');
// const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const keys = require('./config/keys');

const googleAuth = passport.authenticate('google', { session: false });
const authRoutes = require('./routes/authRoutes');
const creditRoutes = require('./routes/creditRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const errorHandler = require('./controllers/errorController');

mongoose.connect(keys.mongoURI).then(
  () => {
    console.log('MongoDB server up 📔️ 📔️ 📔️');
  },
  (err) => {
    console.log('Error connecting to mongoDB server ', err);
  }
);

const app = express();

app.use(express.json());
app.use(
  cookieSession({
    maxAge: 10 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(cors());
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

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use('/auth', authRoutes);

app.use('/api/campaign', campaignRoutes);
app.use('/api/credits', creditRoutes);
app.get('/api/user', (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  }
  res.status(400).json({
    success: false,
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App Up and Running on port : ${PORT} 💫️ 💫️ 💫️`);
});
