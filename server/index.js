const express = require('express');

const app = express();

app.use(express.static('public'));

const port = 3043;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});