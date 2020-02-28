require('newrelic');
require('dontenv').config()
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json())

const PROXY_PORT = process.env.PROXY_PORT || 8080;
const RESERVATIONS_HOSTNAME = process.env.RESERVATIONS_HOSTNAME || 'localhost';
const RESERVATIONS_PORT = process.env.RESERVATION_PORT || 4444

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