// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

// Routes
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// Create comment
app.post('/posts/:id/comments', async (req, res) => {
  // Create random id
  const commentId = randomBytes(4).toString('hex');
  // Get post id
  const { id } = req.params;
  // Get comment object
  const { content } = req.body;
  // Get comments array
  const comments = commentsByPostId[id] || [];
  // Push new comment
  comments.push({ id: commentId, content, status: 'pending' });
  // Update comments
  commentsByPostId[id] = comments;
  // Emit event to event bus
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId: id, status: 'pending' },
  });
  // Send response
  res.status(201).send(comments);
});

// Event handler
app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log('Event Received:', type);
  if (type === 'CommentModerated') {
    const { id, postId, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;
    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: { id, postId, status, content },
    });
  }
  res.send({});
});

// Listen
app.listen(4001, () => console.log('Listening on 4001'));
