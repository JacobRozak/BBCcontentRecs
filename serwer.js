// We can use express as shown as below
const express = require('express')
const app = express()
const path = require('path');
const router = express.Router();
const port = 3001

var views = path.join(__dirname, 'views');
var views1 = path.join(__dirname, 'views1');

app.get('/news', (req, res) => {
  res.sendFile(path.join(views, 'index.html'));
})
app.get('/news/article1', (req, res) => {
  res.sendFile(path.join(views, 'article1.html'));
})
app.get('/news/article2', (req, res) => {
  res.sendFile(path.join(views, 'article2.html'));
})
app.get('/news/article3', (req, res) => {
  res.sendFile(path.join(views, 'article3.html'));
})
app.get('/news/article4', (req, res) => {
  res.sendFile(path.join(views, 'article4.html'));
})
app.get('/news/article5', (req, res) => {
  res.sendFile(path.join(views, 'article5.html'));
})

app.get('/sport', (req, res) => {
  res.sendFile(path.join(views1, 'index1.html'));
})
app.get('/sport/article1', (req, res) => {
  res.sendFile(path.join(views1, 'article6.html'));
})
app.get('/sport/article2', (req, res) => {
  res.sendFile(path.join(views1, 'article7.html'));
})
app.get('/sport/article3', (req, res) => {
  res.sendFile(path.join(views1, 'article8.html'));
})
app.get('/sport/article4', (req, res) => {
  res.sendFile(path.join(views1, 'article9.html'));
})
app.get('/sport/article5', (req, res) => {
  res.sendFile(path.join(views1, 'article10.html'));
})
app.get('/feed', (req, res) => {
  res.sendFile(path.join(views, 'feed.json'));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})