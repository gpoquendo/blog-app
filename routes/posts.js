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

// Create a post
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

// Edit a post
router.get('/edit/:id', (req, res) => {
  const postId = req.params.id;

  // Load existing posts
  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // Find the post to edit by ID
  const postToEdit = posts.find(post => post.id === postId);

  if (postToEdit) {
      res.render('edit', { post: postToEdit });
  } else {
      // Handle the case where the post to edit is not found
      res.status(404).send('Post not found');
  }
});

// Handle the form submission for editing a post
router.post('/edit/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  // Load existing posts
  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  // Find the index of the post to edit by ID
  const postIndex = posts.findIndex(post => post.id === postId);

  if (postIndex !== -1) {
      // Update the post with new data
      posts[postIndex].title = title;
      posts[postIndex].content = content;

      // Save the updated posts array to the file
      fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2), 'utf8');

      // Redirect to the posts page or show a success message
      res.redirect('/posts');
  } else {
      // Handle the case where the post to edit is not found
      res.status(404).send('Post not found');
  }
});

  router.post('/delete/:id', (req, res) => {
    const postId = req.params.id;
  
    // Load existing posts
    const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
    // Filter out the post to delete by ID
    const updatedPosts = posts.filter(post => post.id !== postId);
  
    // Save the updated posts array to the file
    fs.writeFileSync(dataPath, JSON.stringify(updatedPosts, null, 2), 'utf8');
  
    // Redirect to the posts page or show a success message
    res.redirect('/posts');
  });
  
  

module.exports = router;