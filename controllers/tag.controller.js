const Tag = require("../models/tag.model");

exports.getAllTags = async (req,res) => {
  try{
    const tags = await Tag.find();
    res.status(200).send(tags);
  }
  catch(error) {  
    res.status(500).send({message:error});
  }
};

exports.getTagById = async (req, res) => {
  var tagId = req.params.id;
  try {
    const tag = await Tag.findById(tagId);
    if (!tag)
      return res
        .status(500)
        .send({ message: "Tag not found with the Id: " + tagId });
    res.status(200).send(tag);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.insertTag = async (req, res) => {
  const tag = new Tag({
    tagName: req.body.tagName,
  });

  try {
    const savedTag = await tag.save();
    res.status(200).send(savedTag);
  } catch (error) {
    res.send(500).send({ message: error });
  }
};

exports.getTagsBySearchText = async (req, res) => {
  var tagNameFromBody = req.body.tagName;
  if (!tagNameFromBody)
    return res.status(500).send({ message: "Not a valid tagname" });
  var rgx = new RegExp("^" + tagNameFromBody);
  try {
    const tags = await Tag.find({ tagName: { $in: rgx } });
    if (!tags) return res.status(404).send({ message: "Tags are not found" });
    res.status(200).send(tags);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
