const Blog = require("../models/blog.model");

exports.search = async (req, res) => {
  var searchText = req.body.searchText;
  const page = parseInt(req.body.pageNumber);
  const limit = parseInt(req.body.pageSize);
  const skipIndex = (page - 1) * limit;
  const results = {};
  try {
    results.searchResults = await Blog.aggregate([
      {
        $search: {
          index: 'blogIndex',
          text: {
            query: searchText,
            path: {
              'wildcard': '*'
            }
          }
        }
      }
    ])
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skipIndex)
      .exec();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error occured",
    });
  }
};
