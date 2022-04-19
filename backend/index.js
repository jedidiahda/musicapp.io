const express = require('express');
const cors = require('cors');

const userRouter = require('./routes/userRoute');
const songRouter = require('./routes/songRoute');
const playlistRouter = require('./routes/playlistRoute');
const CustomError = require('./errors/custom-error');

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(songRouter);
app.use(playlistRouter);

app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.getCode()).send({
      message: err.message,
    });
  }

  return res.status(500).send({
    errors: {
      message: err.message,
    },
  });
});

app.listen(3000, () => {
  console.log('app listen to port 3000');
});
