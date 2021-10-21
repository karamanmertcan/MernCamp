import Post from '../models/post';

export const createPost = async (req, res) => {
  // console.log(req.body);
  const { content } = req.body;

  if (!content.length) {
    return res.json({
      error: 'Content is required'
    });
  }
  try {
    const post = new Post({
      content,
      postedBy: req.user._id
    });
    await post.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
