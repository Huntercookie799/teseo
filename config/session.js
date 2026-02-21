const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = session({
  secret: 'teseo-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create
    ? MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/sesiones'
      })
    : new MongoStore({
        url: 'mongodb://127.0.0.1:27017/sesiones'
      }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 día
  }
});