const blogsRouter = require('express').Router();
const { userExtractor } = require('../utils/middleware');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments');
  response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user; // comes from middleware userExtractor
  const blog = new Blog({ ...request.body, user: user });

  const savedBlog = await blog.save();

  user.blogs = [...user.blogs, savedBlog._id];
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;
  const blog = { title, author, url, likes };
  const opts = { new: true };
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    opts
  );
  response.json(updatedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user; // comes from middleware userExtractor
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === user._id.toString()) {
    // delete blog found by id
    await blog.deleteOne();

    // deletes blog id from user.blogs
    user.blogs = user.blogs.filter(
      (blogId) => blogId.toString() !== blog._id.toString()
    );
    await user.save();

    response.status(204).end();
  } else {
    response.status(403).json({ error: 'access denied' });
  }
});

blogsRouter.post('/:id/comments', userExtractor, async (request, response) => {
  const { content } = request.body;
  // find blog to comment
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }
  // create comment
  const comment = new Comment({ content });
  const savedComment = await comment.save();

  // add comment to comments in blog
  blog.comments = [...blog.comments, savedComment];
  await blog.save();

  response.status(201).json(savedComment);
});

module.exports = blogsRouter;
