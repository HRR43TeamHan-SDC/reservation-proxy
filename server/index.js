require('newrelic');
const express = require('express');
const axios = require('axios');
const { Readable } = require('stream');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
// const morgan = require('morgan');


const app = express();
app.use(express.json());
// app.use(morgan('dev'));


const html =
`<html>
<head>
  <title>opentable</title>
  <style>
    @font-face {
      font-family: BrandonText;
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
      background-image: url('/images/header.png');
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
      background-image: url('/images/footer.png');
    }
    .area-description {
      height:255px;
      background-image: url('/images/description.png');
      background-repeat: no-repeat;
    }
    .area-menu {
      margin-top: 40px;
    }
    .area-reservation {
      width: 320px;
      height: 320px;
      color: white;
      text-align: center;
      line-height: 550px;
      font-size: 48px;
      font-weight: bold;
    }
    .area-map {
      width: 320px;
      height: 220px;
      background-image: url('/images/map.png');
      margin-top: 20px;
    }
    .area-detail1 {
      width: 320px;
      height: 643px;
      background-image: url('/images/detail1.png');
      background-repeat: no-repeat;
    }
    .area-detail2 {
      width: 320px;
      height: 182px;
      background-image: url('/images/detail2.png');
      background-repeat: no-repeat
    }
    .pictures {
      position: relative;
      width: 100%;
      padding-top: 46%;
    }
    .flex-container {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-content: flex-start;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
    .gallery-more {
      background-color: rgba(0,0,0,.5);
      position: absolute;
      bottom: 0;
      right: 2px;
      color: #ffff;
      cursor: pointer;
      width: 15.332%;
      height: 33.33%;
      font-family: Arial;
      font-size: 2em;
    }
    .img {
      padding: 1px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .img1 {
      width: 23%;
      height: 50%;
    }
    .img2 {
      width: 46%;
      height: 100%;
    }
    .img3 {
      width: 15.332%;
      height: 33.33%;
    }
    .img4 {
      width: 300px;
      height: 300px;
    }
    .circle-image {
      float: left;
    }
    .flag {
      width: 24px;
      height: 24px;
      float: right;
      vertical-align: middle;
      position: absolute;
      top: 0;
      right: 0;
    }
    .show-picture {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.86);
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .hide-picture {
      display: none;
    }
    .show-report {
      position: fixed;
      width: 25rem;
      height: 15rem;
      top: 50%;
      left: 50%;
      background-color: #fff;
      justify-content: center;
      align-items: center;
      z-index: 1050;
      border-radius: 5px;
      margin-top: -20px;
      margin-left: -200px;
      font-size: 1.25rem;
      font-family: Arial;
      text-align: center;
    }
    .hide-report {
      display: none;
    }
    .report-button {
      background-color: #61bddb;
      color: #fff;
      font-size: 16px;
      text-align: center;
      border-radius: 3px;
      width: 90%;
      margin-left: 20px;
      margin-right: 20px;
      padding-top: 0.6rem;
      padding-right: 1.75rem;
      padding-bottom: 0.6rem;
      padding-left: 1.75rem;
      border-radius: 3px;
      cursor: pointer;
    }
    #cancel-button {
      font-size: 16px;
      text-align: center;
      width: 90%;
      margin-left: 20px;
      margin-right: 20px;
      padding-top: 0.6rem;
      padding-right: 1.75rem;
      padding-bottom: 0.6rem;
      padding-left: 1.75rem;
      background-color: #fff;
      border-color: #fff;
      color: #2b9abf;
      border-width: .05rem;
      cursor: pointer;
    }
    .footer {
      position: relative;
      margin: 8px 0 0;
      display: flex;
      justify-content: space-between;
    }
    .footer-text {
      float: left;
      margin: 0 8px 0 0;
      position: absolute;
      left: -10px;
      width: 320px;
    }
    .diner-text {
      color: #ffff;
      font-family: Arial;
      margin-left: 3.5em;
      padding-top: .5em;
    }
    .dined-on {
      padding-top: .3em;
    }
    text {
      display: block;
      white-space: nowrap;
      justify-content: center;
    }
    #close-picture {
      position: absolute;
      top: 20px;
      right: 0;
      cursor: pointer;
      font-size: 20px;
      color: #91949a;
      padding: 25px;
      font-family: sans-serif;
      box-sizing: border-box;
    }
    #right-arrow {
      top: 50%;
      cursor: pointer;
      font-size: 20px;
      color: #91949a;
      font-size: 1.2rem;
      font-family: icons;
      font-weight: 700;
      display: inline-block;
      align-items: flex-start;
      text-align: center;
      box-sizing: border-box;
      padding: 1px 50px 2px;
    }
    #left-arrow {
      top: 50%;
      left: 0;
      cursor: pointer;
      font-size: 20px;
      color: #91949a;
      font-family: icons;
      font-weight: 700;
      line-height: 1;
      font-size: 1.2rem;
      transform: rotate(180deg);
      display: inline-block;
      justify-content: space-between;
      box-sizing: border-box;
      text-align: center;
      padding: 1px 50px 2px;
    }
    .disabled {
      pointer-events: none;
      cursor: default;
      opacity: 0.6;
    }
    .reservation-title, .input-title, .reservation-booked {
      text-align: left;
      color: black;
    }
  </style>
</head>
<body>
  <div class="grid-container">
    <div class="grid-header"></div>
    <div class="grid-left-gutter"></div>
    <div class="grid-left">
      <div class="area-title">
        <div id="title">not loaded</div>
      </div>
      <div class="area-description">
        &nbsp;
      </div>
      <div class="area-photo">
        <div id="photos">not loaded</div>
      </div>
      <div class="area-menu">
        <div id="root">not loaded</div>
      </div>
      <div class="area-review">
        <br><br>
        <div id="app">not loaded</div>
      </div>
    </div>
    <div class="grid-gap"></div>
    <div class="grid-right">
      <div class="area-reservation"><div id="reservations"></div></div>
      <div class="area-map"></div>
      <div class="area-detail1"></div>
      <div class="area-detail2"></div>
    </div>
    <div class="grid-right-gutter"></div>
    <div class="grid-footer"></div>
  </div>
  <script src="http://ec2-54-193-70-33.us-west-1.compute.amazonaws.com:4444/bundle.js"></script>
  <script src="http://sdc.heskett.ninja/bundle.js"></script>
  <script src="http://ec2-18-188-10-239.us-east-2.compute.amazonaws.com:3300/bundle.js"></script>
  <script src="http://ec2-3-133-85-12.us-east-2.compute.amazonaws.com:3009/bundle.js"></script>
</body>
</html>`;




// HTML IMAGES
app.get('/images/*', (req, res) => {
  const gzip = zlib.createGzip();
  res.set({ 'Content-Encoding': 'gzip' });
  fs.createReadStream(path.resolve(__dirname, `../public${req.url}`)).pipe(gzip).pipe(res);
});




// RESERVATION MODULE
app.get('/api/reservations/:restaurantId/dateTime/:dateTime', (req, res) => {
  res.redirect(307, `http://ec2-54-193-70-33.us-west-1.compute.amazonaws.com:4444${req.url}`);
});

// REVIEWS MODULE
app.get('/api/reviews/:restaurantId', (req, res) => {
  res.redirect(307, `http://ec2-18-188-10-239.us-east-2.compute.amazonaws.com:3300${req.url}`);
})


// MENU MODULE
// const MENU_HOSTNAME = process.env.MENU_HOSTNAME || 'localhost';
// const MENU_PORT = process.env.MENU_PORT || 8001;

app.get('/gettitle/:id', (req, res) => {
  res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
});

app.get('/getmenu/:id', (req, res) => {
  res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
});


app.post('/api/restaurant', (req, res) => {
  res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
})


// Try to use the following vs all the routes to simplify code
// app.use('/api/restaurant/:id', (req, res) => {
//   console.log(req.url);
//   res.redirect(`http://sdc.heskett.ninja${req.url}`)
// });


app.route('/api/restaurant/:id')
  .get((req, res) => {
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  })
  .put((req, res) => {
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  })
  .delete((req, res) => {
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  });


app.route('/api/menu/:id')
  .get((req, res) => {
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  })
  .post((req, res) => {
    // Used to post a new section
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  })
  .put((req, res) => {
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  })
  .delete((req, res) => {
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  });


app.route('/api/section/:id')
  .get((req, res) => {
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  })
  .post((req, res) => {
    // Used to post a new item
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  })
  .put((req, res) => {
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  })
  .delete((req, res) => {
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  });


app.route('/api/item/:id')
  .get((req, res) => {
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  })
  .put((req, res) => {
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  })
  .delete((req, res) => {
    res.redirect(307, `http://sdc.heskett.ninja${req.url}`);
  });


// app.get('/getmenu/:id', (req, res) => {
//   axios.get(`http://sdc.heskett.ninja${req.url}`)
//   .then(response => response.data)
//   .then(data => res.send(data))
//   .catch(err => console.log('error at proxy serving',err));
// });




// PHOTO GALLERY MODULE
app.get('/api/photos/:id', (req, res) => {
  // res.redirect(`http://ec2-3-133-85-12.us-east-2.compute.amazonaws.com:3009/api/photos/${req.params.id}`);
  axios.get(`http://ec2-3-133-85-12.us-east-2.compute.amazonaws.com:3009/api/photos/${req.params.id}`)
    .then((response) => {
  //     const stream = new Readable({
  //       read() {
  //         this.push(JSON.stringify(response.data));
  //         this.push(null);
  //       },
  //     });
  //     stream.pipe(res);
      res.send(response.data);
    })
    .catch((err) => res.send(err));
});

app.post('/api/photos', (req, res) => {
  // res.redirect(307, `http://ec2-3-133-85-12.us-east-2.compute.amazonaws.com:3009/api/photos`);
  axios.post(`http://ec2-3-133-85-12.us-east-2.compute.amazonaws.com:3009/api/photos`, req.body)
    .then((response) => res.send(response))
    .catch((err) => res.send(err));
});



//////////////////////////////////////////////////////////////////////////////////////


// app.use(express.static('public'));
// app.use('/loaderio*', express.static(path.resolve(__dirname, '../loaderio.txt')));
// // app.use('/:id', express.static('public'));
app.use('/:id', (req, res) => {
  const gzip = zlib.createGzip();
  res.set({ 'Content-Encoding': 'gzip' });

  const stream = new Readable({
    read() {
      this.push(html, 'utf8');
      this.push(null);
    },
  });

  stream.pipe(gzip).pipe(res);
  // res.send(html);
});


const PORT = process.env.PORT || 3043;
app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});