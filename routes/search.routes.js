module.exports = (app) => {
    const searchController = require('../controllers/search.controller');
    app.post('/search', searchController.search);
}