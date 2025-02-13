const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dbConfig = require("./config/database.config.js");

const app = express();
const corsOptions = {
  origin: "*",
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
// app.use(function(req, res, next) {
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, Content-Type, Accept"
//   );
//   next();
// });
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    dbName: "vaidhyamitra",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database vaidhyamitra");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

const loginRoutes = require("./routes/login.routes");
loginRoutes(app);

const blogRoutes = require("./routes/blog.routes");
blogRoutes(app);

const searchRoutes = require("./routes/search.routes");
searchRoutes(app);

const tagRoutes = require("./routes/tag.routes");
tagRoutes(app);

const bookMarkRoutes = require("./routes/bookMark.routes");
bookMarkRoutes(app);

const commentRoutes = require("./routes/comment.routes");
commentRoutes(app);

const port = process.env.PORT || 3553;
app.set("port", port);

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});

module.exports = app;
