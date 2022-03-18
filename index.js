const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const keys = require('./config/keys');

// const googleAuth = passport.authenticate('google', { session: false });
const authRoutes = require('./routes/authRoutes');
const creditRoutes = require('./routes/creditRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const errorHandler = require('./controllers/errorController');

/**
 * Connect to mongoDB using database URI
 */
mongoose.connect(keys.mongoURI).then(
  () => {
    console.log('MongoDB server up 📔️ 📔️ 📔️');
  },
  (err) => {
    console.log('Error connecting to mongoDB server ', err);
  }
);

/* Initialize application */
const app = express();

/* 
  use json() for parsing incoming request bodies with json payloads. 
  A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body)
  
  use urlencoded() for parsing url encoded bodies like &username=nithin&biwi=peeth
  use cookieSession() for storing/maintaining cookies. this adds req.session property and is used by passport to deserialize user.
 */
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 10 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

/* Enable cross origin resource sharing : that is allow other orgins to make request to our server */
app.use(cors());

/* 
  use cookieParser() will parse/read the Cookie header from the request and add the cookie data to req.cookies.
  not used now, but required if we need access to actual cookies in our application.
*/
app.use(cookieParser());

/* initialize passport and session() is used to deserialize session_id in req to user object */
app.use(passport.initialize());
app.use(passport.session());

/* static() : used to serve static files. here it points to build folder in client directory */
app.use(express.static(path.join(__dirname, 'client', 'build')));

/* authentication routes */
app.use('/auth', authRoutes);

/* campaign routes */
app.use('/api/campaign', campaignRoutes);

/* credit routes : not yet implemented*/
app.use('/api/credits', creditRoutes);

/* get user after authentication */
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

/* for all other routes we just send a dummy file */
// VERYY VERYYY IMPORTANT FOR SERVING FILES TO FRONTEND.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

/* global error handler, is called when next(err) is called in controllers */
app.use(errorHandler);

/* Starting application */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App Up and Running on port : ${PORT} 💫️ 💫️ 💫️`);
});
