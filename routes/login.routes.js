module.exports = (app) => {
    const loginController = require('../controllers/login.controllers');

    app.get('/user/:id',loginController.getUser);
    app.post('/login',loginController.loginChecker);
}