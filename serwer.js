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

var news_views = path.join(__dirname, "news_views");
var sports_views = path.join(__dirname, "sports_views");
var iplayer_views = path.join(__dirname, "iplayer_views");

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
  res.sendFile(path.join(news_views, "index.html"));
});

app.use("/reportClick", reportClickRouter);

app.get("/populateRecsContainer.js", (req, res) => {
  res.sendFile(path.join(news_views, "populateRecsContainer.js"));
});

app.get("/news/article1", (req, res) => {
  res.sendFile(path.join(news_views, "article1.html"));
});
app.get("/news/article2", (req, res) => {
  res.sendFile(path.join(news_views, "article2.html"));
});
app.get("/news/article3", (req, res) => {
  res.sendFile(path.join(news_views, "article3.html"));
});
app.get("/news/article4", (req, res) => {
  res.sendFile(path.join(news_views, "article4.html"));
});
app.get("/news/article5", (req, res) => {
  res.sendFile(path.join(news_views, "article5.html"));
});

app.get("/sport", (req, res) => {
  res.sendFile(path.join(sports_views, "index1.html"));
});
app.get("/sport/article1", (req, res) => {
  res.sendFile(path.join(sports_views, "article6.html"));
});
app.get("/sport/article2", (req, res) => {
  res.sendFile(path.join(sports_views, "article7.html"));
});
app.get("/sport/article3", (req, res) => {
  res.sendFile(path.join(sports_views, "article8.html"));
});

app.get("/sport/article4", (sports_views, res) => {
  res.sendFile(path.join(sports_views, "article9.html"));
});
app.get("/sport/article5", (req, res) => {
  res.sendFile(path.join(sports_views, "article10.html"));
});

app.get("/iplayer", (req, res) => {
  res.sendFile(path.join(iplayer_views, "index2.html"));
});

app.get("/iplayer/article9", (req, res) => {
  res.sendFile(path.join(iplayer_views, "article10.html"));
});

app.get("/iplayer/article10", (req, res) => {
  res.sendFile(path.join(iplayer_views, "article11.html"));
});

app.get("/iplayer/article11", (req, res) => {
  res.sendFile(path.join(iplayer_views, "article12.html"));
});

app.get("/iplayer/article12", (req, res) => {
  res.sendFile(path.join(iplayer_views, "article13.html"));
});

app.get("/feed", (req, res) => {
  res.sendFile(path.join(news_views, "feed.json"));
});

app.get("/recs", (req, res) => {
  res.sendFile(path.join(news_views, "recs.json"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
