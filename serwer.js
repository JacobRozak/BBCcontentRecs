// We can use express as shown as below
const express = require("express");
const app = express();
const path = require("path");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const uuidv4 = require("uuid/v4");
const router = express.Router();
const port = 3001;
const DYAPI = require("./DYAPI");
const reportClickRouter = require("./reportClick");
const { fstat } = require("fs");

var views = path.join(__dirname, "views");
var views1 = path.join(__dirname, "views1");

const callApi = async (req) => {
  req.dyContext.page.type = "HOMEPAGE";
  const apiResponse = await DYAPI.choose(
    req.userId,
    req.sessionId,
    req.dyContext,
    ["BBC Recommendations Campaign"]
  );
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/** userId management */

app.use((req, res, next) => {
  let { userId } = req.cookies;
  if (!userId) {
    userId = uuidv4();
    res.cookie("userId", userId, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }
  req.userId = userId;
  next();
});

/** session management */

app.use(
  cookieSession({
    name: "session",
    secret: "somesecretkeyhash",
  })
);

app.use((req, _res, next) => {
  if (req.session.isNew) {
    // cookieSession defines what is considered a new session
    req.session.sessionId = uuidv4();
  }
  req.sessionId = req.session.sessionId;
  // for the sake of simplicity the cart is stored in the session as well
  req.cart = req.session.cart || { total: 0, products: [] };
  req.session.cart = req.cart;
  next();
});

/* add dyContext */
app.use((req, _res, next) => {
  req.dyContext = {
    page: {
      location: `${req.protocol}://${req.hostname}${req.originalUrl}`,
      referrer: req.headers.referer || "",
      data: [],
    },
    device: {
      userAgent: req.headers["user-agent"] || "",
      ip: req.ip,
    },
    pageAttributes: req.query,
  };
  next();
});

app.use(async (req, _, next) => {
  if (req.path.includes("article")) {
    await callApi(req);
  }
  next();
});

app.get("/news", (req, res) => {
  res.sendFile(path.join(views, "index.html"));
});

app.use("/reportClick", reportClickRouter);

app.get("/news/article1", (req, res) => {
  res.sendFile(path.join(views, "article1.html"));
});
app.get("/news/article2", (req, res) => {
  res.sendFile(path.join(views, "article2.html"));
});
app.get("/news/article3", (req, res) => {
  res.sendFile(path.join(views, "article3.html"));
});
app.get("/news/article4", (req, res) => {
  res.sendFile(path.join(views, "article4.html"));
});
app.get("/news/article5", (req, res) => {
  res.sendFile(path.join(views, "article5.html"));
});

app.get("/sport", (req, res) => {
  res.sendFile(path.join(views1, "index1.html"));
});
app.get("/sport/article1", (req, res) => {
  res.sendFile(path.join(views1, "article6.html"));
});
app.get("/sport/article2", (req, res) => {
  res.sendFile(path.join(views1, "article7.html"));
});
app.get("/sport/article3", (req, res) => {
  res.sendFile(path.join(views1, "article8.html"));
});
app.get("/sport/article4", (req, res) => {
  res.sendFile(path.join(views1, "article9.html"));
});
app.get("/sport/article5", (req, res) => {
  res.sendFile(path.join(views1, "article10.html"));
});
app.get("/feed", (req, res) => {
  res.sendFile(path.join(views, "feed.json"));
});

app.get("/recs", (req, res) => {
  res.sendFile(path.join(views, "recs.json"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
