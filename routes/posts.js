const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/posts.json');

router.get('/', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  res.render('posts', { posts });
});

router.post('/', (req, res) => {
  const { title, content } = req.body;

  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const postId = uuidv4();

  const newPost = {
    id: postId,
    title,
    content,
  };

  posts.push(newPost);

  fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2), 'utf8');

  res.redirect('/posts');
});

router.get('/edit/:id', (req, res) => {
  const postId = req.params.id;

  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const postToEdit = posts.find(post => post.id === postId);

  res.render('edit', { post: postToEdit });
});

router.post('/edit/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const postIndex = posts.findIndex(post => post.id === postId);

  posts[postIndex].title = title;
  posts[postIndex].content = content;

  fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2), 'utf8');

  res.redirect('/posts');
});

router.post('/delete/:id', (req, res) => {
  const postId = req.params.id;

  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const updatedPosts = posts.filter(post => post.id !== postId);

  fs.writeFileSync(dataPath, JSON.stringify(updatedPosts, null, 2), 'utf8');

  res.redirect('/posts');
});

module.exports = router;