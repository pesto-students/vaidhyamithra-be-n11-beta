module.exports = (app) => {
    const loginController = require('../controllers/login.controllers');

    app.post('/signup', loginController.createUser);
    app.post('/login',loginController.loginChecker);
}