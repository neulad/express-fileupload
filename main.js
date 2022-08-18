const express = require("express"),
  cookies = require("cookie-parser"),
  session = require("express-session"),
  redisStore = require("connect-redis")(session),
  redis = require("redis"),
  passport = require("passport"),
  randToken = require("rand-token"),
  rewriteMethods = require("method-override"),
  logger = require("morgan"),
  router = require("./routes/index"),
  errorController = require("./controllers/errorController"),
  fileUpload = require("express-fileupload"),
  User = require("./models/user"),
  cors = require("cors");
  
const app = express();

app.set("port", process.env.PORT || 3000);

app.use(express.json());

app.use(express.urlencoded({
  extended: false
}));

app.use(express.static("public"));

app.use(rewriteMethods("_method", {methods: ["GET", "POST"]}));

app.use(cookies(process.env.COOKIE_SECRET));

app.use(session({

  store: new redisStore({
  
    client: redis.createClient()
    
  }),

  secret: process.env.COOKIE_SECRET,
  
  cookie: {
    maxAge: 4000000
  },
  
  saveUninitialized: false,
  resave: false

}));

app.use(passport.initialize());

app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(logger(":method :url :status * :response-time ms"));

app.use(fileUpload({

  useTempFiles : true

}));

app.use(cors());

app.use("/", router);

app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server is running on http://localhost:${app.get("port")}/`);
})



































  
