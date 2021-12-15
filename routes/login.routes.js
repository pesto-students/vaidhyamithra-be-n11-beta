module.exports = (app) => {
    const loginController = require('../controllers/login.controllers');

    app.post('/signup', loginController.signUp);
    app.post('/login',loginController.login);
}