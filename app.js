require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
const routes = require("./routes/index");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect(
  process.env.MONGO_URL || "mongodb://localhost:27017/bitfilmsdb"
);

app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(routes);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

app.listen(PORT);
