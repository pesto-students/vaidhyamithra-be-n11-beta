const express = require('express');
const app = express();

const loginRoutes = require('./routes/login.routes');
loginRoutes(app);

const port = 3553;
app.listen(port, () => {
    console.log("Server is listening on port " + 3553);
});

module.exports = app;