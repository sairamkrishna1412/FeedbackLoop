const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send({ HI: 'Stud boui' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App Up and Running on port : ${PORT}`);
});
