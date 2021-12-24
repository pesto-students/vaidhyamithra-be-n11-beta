const Blog = require("../models/blog.model");

exports.search = async (req, res) => {
  var searchText = req.body.searchText;
  const page = parseInt(req.body.pageNumber);
  const limit = parseInt(req.body.pageSize);
  const skipIndex = (page - 1) * limit;
  var rgx = new RegExp("^"+ searchText);
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
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $unwind: "$authorDetails",
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          authorId: 1,
          tags: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          "authorDetails._id": 1,
          "authorDetails.name": 1,
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
          totalCount: {
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
