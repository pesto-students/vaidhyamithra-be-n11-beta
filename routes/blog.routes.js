module.exports = (app) => {
    const blogController = require('../controllers/blog.controller');

    app.get('/blogById/:id', blogController.getBlogById);

    app.post('/blogsByTags', blogController.getBlogsByTags);

    app.get('/blogsByAuthor', blogController.getBlogsByAuthor);

    app.post('/blog', blogController.insertBlog);

    app.put('/blog/:blogId', blogController.updateBlog);
}