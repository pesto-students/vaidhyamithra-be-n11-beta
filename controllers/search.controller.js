const Blog = require("../models/blog.model");

exports.search = async (req, res) => {
  var searchText = req.body.searchText;
  const page = parseInt(req.body.pageNumber);
  const limit = parseInt(req.body.pageSize);
  const skipIndex = (page - 1) * limit;
  try {
    let results = await Blog.aggregate([
      {
        $search: {
          index: "blogIndex",
          text: {
            query: searchText,
            path: {
              wildcard: "*",
            },
          },
        },
      },
      {
        $facet: {
          paginatedResults: [{ $skip: skipIndex }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $addFields: {
          total: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
          },
        },
      },
      {
        $project: {
          paginatedResults: 1,
          totalCount: 1,
        },
      },
    ]);
    res.status(200).send(results[0]);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error occured",
    });
  }
};
