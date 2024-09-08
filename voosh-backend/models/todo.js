const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  status: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  uid: {
    type: String,
    required: true,
  }
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
