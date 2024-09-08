const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcrypt');
const Task  = require('./models/todo')
const User = require('./models/user')
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const databaseUrl = process.env.MONGO_CLIENT
const secretKey = process.env.JWT_SECRET_KEY

// Middleware
app.use(bodyParser.json());
app.use(cors());

const hashPassword = async(password) =>{
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// MongoDB connection
mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Database connected!'))
.catch(err => console.log(err));

// CRUD routes

// Create a task
app.post("/addTasks", async (req, res) => {
  const { title, body, status, uid } = req.body;

//  console.log("Task received to add:", req.body);

  // Validate the request body
  if (!title || !body || !status) {
    return res.status(400).send({ message: "Title, body, and status are required" });
  }

  try {
    // Create a new task with the provided data
    const task = new Task({ title, body, status, uid });
    
    // Save the task to the database
    await task.save();

    // Send the created task as a response
    res.status(201).send(task);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).send({ message: "Server error while adding task" });
  }
});

// Read all tasks
app.get("/tasks", async (req, res) => {
  try {
    const { uid } = req.query;  // Extract the uid from the query parameters
    if (!uid) {
      return res.status(400).send({ error: "UID is required" });
    }
    
    // Fetch tasks associated with the provided uid
    const tasks = await Task.find({ uid: uid });
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a task
app.put("/updateTasks/:id", async (req, res) => {
//  console.log("this is received for update", req);
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a task
app.delete("/deleteTasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Saving and Retrieving user Details

app.post('/register', async (req, res) => {
  const { userId, email, firstname,lastname, password, photo } = req.body;
//  console.log("body:",req.body);

  try {
    let user = await User.findOne({email});
    let pass = password ? await hashPassword(password): '';
    let uid = !userId ? await uuidv4() : userId;
    if (!user) {
      user = await User.create({
        uid: uid,
        email:email,
        firstname: firstname,
        lastname: lastname,
        photoLink: photo,
        password: pass,
      });
//      console.log("user created", user);
      await user.save();
      return res.status(201).json({ message: 'User registered successfully', user })
    } else {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
  } catch (error) {
    console.error('Error during signUp', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async(req, res) =>{
  const {email, password} = req.body;
//  console.log(req.body);
  try{
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: 'User not found'});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message: 'Invalid credentials'});
    }
    const payload = {
      user: user.uid
    }
    jwt.sign(payload, secretKey, {expiresIn: 3600}, (err, token) => {
      if(err) throw err;
      res.status(200).json({token, payload});
    });
  } catch(error){
    console.error('Error during login', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/getUser', async(req,res) =>{
  const {uid} = req.body;
//  console.log("userID to fetch USer", req.body);
  try{  
    const user = await User.findOne({uid});
    if(user){
      const userData = {
        firstname: user.firstname,
        lastname: user.lastname,
        photoUrl: user.photoLink,
      }
      return res.status(200).json({userData});
    }else{
      return res.status(400).json({message: 'Error fetching data'});
    }
  }catch(error){
    console.error('Error during getUser', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
//  console.log(`Server is running on port ${PORT}`);
});
