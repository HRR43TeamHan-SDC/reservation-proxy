require('newrelic');
require('dontenv').config()
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json())

const PROXY_PORT = process.env.PROXY_PORT || 8080;

const RESERVATIONS_HOSTNAME = process.env.RESERVATIONS_HOSTNAME || 'localhost';
const RESERVATIONS_PORT = process.env.RESERVATION_PORT || 4444

html = `
<html>
  <head>
    <title>opentable</title>
    <style>
    @font-face {
      font-family: BrandonText;
      src: url("BrandonText-Regular.otf") format("opentype");
    }
    body {
      margin: 0;
    }
    .grid-container {
      display: grid;
      grid-template-areas:
        'header  header header header header'
        'lgutter left   gap    right  rgutter'
        'footer  footer footer footer footer';
      grid-template-columns: 144px 640px 32px 320px auto;
      grid-gap: 0px;
    }
    .grid-header {
      grid-area: header;
      height: 371px;
      background-image: url('images/header.webp');
    }
    .grid-left-gutter {
      grid-area : lgutter;
    }
    .grid-left {
      grid-area: left;
      width: 640px;
    }
    .grid-gap {
      grid-area: gap;
      width:32px;
    }
    .grid-right {
      grid-area: right;
      width: 320px;
    }
    .grid-right-gutter {
      grid-area : rgutter;
    }
    .grid-footer {
      grid-area: footer;
      height: 795px;
      background-image: url('images/footer.webp');
    }
    .area-description {
      height:255px;
      background-image: url('images/description.webp');
      background-repeat: no-repeat;
    }
    .area-menu {
      margin-top: 40px;
    }
    .area-reservation {
      width: 320px;
      height: 320px;
      background-image: url('https://cnet3.cbsistatic.com/img/_XpU5t4ywu3xYvA4dClTJay1hQA=/644x0/2015/07/07/4eb66f23-8702-46ac-b15f-c61352b41ccd/hansolo2.jpg');
      background-size: cover;
      color: white;
      text-align: center;
      line-height: 550px;
      font-size: 48px;
      font-weight: bold;
    }
    .area-map {
      width: 320px;
      height: 220px;
      background-image: url('images/map.webp');
      margin-top: 20px;
    }
    .area-detail1 {
      width: 320px;
      height: 643px;
      background-image: url('images/detail1.webp');
      background-repeat: no-repeat;
    }
    .area-detail2 {
      width: 320px;
      height: 182px;
      background-image: url('images/detail2.webp');
      background-repeat: no-repeat
    }
    </style>
  </head>
  <body>
    <div class="grid-container">
      <div class="grid-header"></div>
      <div class="grid-left-gutter"></div>
      <div class="grid-left">
        <div class="area-title"><div id="title">menu module title not loaded</div></div>
        <div class="area-description"><!-- &nbsp; --></div>
        <div class="area-photo"><div id="photos">photo module not loaded</div></div>
        <div class="area-menu"><div id="root">menu module menus not loaded</div></div>
        <div class="area-review"><br><br><div id="app">review module not loaded</div></div>
      </div>
      <div class="grid-gap"></div>
      <div class="grid-right">
        <div class="area-reservation">
        <div id="reservations">
        MVP BABY!
      </div>
      </div>
        <div class="area-map"></div>
        <div class="area-detail1"></div>
        <div class="area-detail2"></div>
      </div>
      <div class="grid-right-gutter"></div>
      <div class="grid-footer"></div>
    </div>
    <script src="http://${RESERVATIONS_HOSTNAME}:${RESERVATIONS_PORT}/bundle.js"></script>
  </body>
</html>
`

// Reservation
app.get('/api/reservations/:restaurantId/dateTime/:dateTime', (req, res) => {
  axios.get(`http://${RESERVATIONS_HOSTNAME}:${RESERVATIONS_PORT}/api/reservations/${req.params.restaurantId}/dateTime/${req.params.dateTime}`)
  .then(response => response.data)
  .then(data => res.send({data}))
  .catch(err => console.log('error at proxy serving', err))
})

app.use('/:restaurantId', express.static('public'));

// app.get('/reservations/:restaurantId', (req, res) => {
//   axios.get(`http://localhost:4444/api/reservations/1/dateTime/2020-02-23%2001:45:00-08`)
  // .then(response => response.data)
  // .then(data => res.send({data}))
  // .catch(err => console.log('error at proxy serving', err))
// })
// app.use('/reservations/?id=:restaurantId', express.static('public'));

// const port = 3043;

app.listen(PROXY_PORT, () => {
  console.log(`App listening on port ${PROXY_PORT}`);
});