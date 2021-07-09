const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const { initialBlogs, blogsInDb, usersInDb } = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

// ======== BLOG TESTS =========

describe('when there are initially blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('test', 10);
    const user = new User({ username: 'test', passwordHash });
    await user.save();

    await Blog.insertMany(
      initialBlogs.map((blog) => ({ ...blog, user: user._id }))
    );
  });

  describe('getting blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs');
      expect(response.body).toHaveLength(initialBlogs.length);
    });

    test('blog unique identifier is named id', async () => {
      const response = await api.get('/api/blogs');

      const blogToTest = response.body[0];
      expect(blogToTest.id).toBeDefined();
    });
  });

  describe('addition of a new blog', () => {
    test('a blog can be added', async () => {
      const response = await api
        .post('/api/login')
        .send({ username: 'test', password: 'test' });

      const token = `Bearer ${response.body.token}`;

      const newBlog = {
        title: 'New blog for test',
        author: 'Tester',
        url: 'https://newblogtest.com',
        likes: 3,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await blogsInDb();
      expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

      const titles = blogsAtEnd.map((blog) => blog.title);
      expect(titles).toContain('New blog for test');
    });

    test('a blog without likes property defaults to 0', async () => {
      const response = await api
        .post('/api/login')
        .send({ username: 'test', password: 'test' });

      const token = `Bearer ${response.body.token}`;

      const newBlog = {
        title: 'No likes property',
        author: 'Tester',
        url: 'https://nolikestest.com',
      };

      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await blogsInDb();
      const addedBlog = blogsAtEnd[blogsAtEnd.length - 1];
      expect(addedBlog.likes).toBe(0);
    });

    test('a blog without title/url properties returns 400 Bad Request', async () => {
      const response = await api
        .post('/api/login')
        .send({ username: 'test', password: 'test' });

      const token = `Bearer ${response.body.token}`;

      const newBlog = {
        author: 'Tester',
        likes: 4,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(400);
    });

    test('fails if token is missing w/ 401 Unauthorized', async () => {
      const newBlog = {
        title: 'New blog for test',
        author: 'Tester',
        url: 'https://newblogtest.com',
        likes: 0,
      };

      await api.post('/api/blogs').send(newBlog).expect(401);
    });
  });

  describe('updating a blog', () => {
    test('updating likes succeds with status 200 if id is valid', async () => {
      const blogsAtStart = await blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const blogEdit = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

      await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogEdit).expect(200);

      const blogsAtEnd = await blogsInDb();
      expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes + 1);
    });
  });

  describe('deletion of a blog', () => {
    test('succeds with status 204 if id is valid', async () => {
      const response = await api
        .post('/api/login')
        .send({ username: 'test', password: 'test' });

      const token = `Bearer ${response.body.token}`;

      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', token)
        .expect(204);

      const blogsAtEnd = await blogsInDb();
      expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

      const titles = blogsAtEnd.map((blog) => blog.title);
      expect(titles).not.toContain(blogToDelete.title);
    });
  });

  describe('adding a comment to a blog', () => {
    test("should succed with status 201 if there's content", async () => {
      // login for token
      const response = await api
        .post('/api/login')
        .send({ username: 'test', password: 'test' });

      const token = `Bearer ${response.body.token}`;

      // get list of blogs and Blog to add comment
      const [blogToComment] = await blogsInDb();
      const commentsAtStart = blogToComment.comments;

      const newComment = {
        content: 'my first comment',
      };

      // post request to add comment and expect status 201
      await api
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .set('Authorization', token)
        .send(newComment)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      // check length of comments has increased by 1 in blogToComment
      const [blogCommented] = await blogsInDb();
      const commentsAtEnd = blogCommented.comments;

      expect(commentsAtEnd).toHaveLength(commentsAtStart.length + 1);

      // check that comment is added to comments in blogToComment
      const contents = commentsAtEnd.map((comment) => comment.content);
      expect(contents).toContain(newComment.content);
    });

    test('a comment without content returns 400 Bad Request', async () => {
      const response = await api
        .post('/api/login')
        .send({ username: 'test', password: 'test' });

      const token = `Bearer ${response.body.token}`;

      const [blogToComment] = await blogsInDb();

      const newComment = {};

      await api
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .set('Authorization', token)
        .send(newComment)
        .expect(400);
    });

    test('fails if token is missing w/ 401 Unauthorized', async () => {
      const blogsAtStart = await blogsInDb();
      const [blogToComment] = blogsAtStart;

      const newComment = {
        content: 'my unauthorized comment',
      };

      await api
        .post(`/api/blogs/${blogToComment.id}/comments`)
        .send(newComment)
        .expect(401);
    });
  });
});

// ======== USER TESTS =========

describe('when there is initially one user', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });

  describe('getting users', () => {
    test('users are returned as json', async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('gets all users', async () => {
      const response = await api.get('/api/users');
      expect(response.body).toHaveLength(1);
    });

    test("getting users doesn't return password/passwordHash", async () => {
      const response = await api.get('/api/users');
      const properties = Object.keys(response.body[0]);

      expect(properties).not.toContain('password');
      expect(properties).not.toContain('passwordHash');
    });
  });

  describe('creation of user', () => {
    test('creation succeds with status 200', async () => {
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: '1234',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDb();

      expect(usersAtEnd).toHaveLength(2);
    });

    test("fails if username missing w/ 400 and 'is required' ", async () => {
      const newUser = {
        name: 'Superuser',
        password: '1234',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('`username` is required');

      const usersAtEnd = await usersInDb();
      expect(usersAtEnd).toHaveLength(1);
    });

    test("fails if username isn't long enough w/ 400 and 'is shorter' ", async () => {
      const newUser = {
        username: 'su',
        name: 'Superuser',
        password: '1234',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain(
        'is shorter than the minimum allowed length (3)'
      );

      const usersAtEnd = await usersInDb();
      expect(usersAtEnd).toHaveLength(1);
    });

    test("fails if username is taken w/ 400 and 'to be unique' ", async () => {
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: '1234',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('`username` to be unique');

      const usersAtEnd = await usersInDb();
      expect(usersAtEnd).toHaveLength(1);
    });

    test("fails if password missing w/ 400 and 'is required' ", async () => {
      const newUser = {
        username: 'superuser',
        name: 'Superuser',
        password: '',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('`password` is required');

      const usersAtEnd = await usersInDb();
      expect(usersAtEnd).toHaveLength(1);
    });

    test("fails if password isn't long enough w/ 400 and 'is shorter' ", async () => {
      const newUser = {
        username: 'superuser',
        name: 'Superuser',
        password: '1',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain(
        '`password` needs to be at least 3 characters long'
      );

      const usersAtEnd = await usersInDb();
      expect(usersAtEnd).toHaveLength(1);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
