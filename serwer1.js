// We can use express as shown as below
const express = require('express')
const app = express()
const path = require('path');
const router = express.Router();
const port = 3001

var views = path.join(__dirname, 'views1');

app.get('/sport', (req, res) => {
  res.sendFile(path.join(views, 'index1.html'));
})
app.get('/sport/article1', (req, res) => {
  res.sendFile(path.join(views, 'article6.html'));
})
app.get('/sport/article2', (req, res) => {
  res.sendFile(path.join(views, 'article7.html'));
})
app.get('/sport/article3', (req, res) => {
  res.sendFile(path.join(views, 'article8.html'));
})
app.get('/sport/article4', (req, res) => {
  res.sendFile(path.join(views, 'article9.html'));
})
app.get('/sport/article5', (req, res) => {
  res.sendFile(path.join(views, 'article10.html'));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})