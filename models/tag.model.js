const mongoose = require("mongoose");
const TagSchema = mongoose.Schema(
  {
    tagName: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Tag", TagSchema);
