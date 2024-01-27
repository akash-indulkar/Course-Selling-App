const express = require('express');
const { authenticateUserJwt, userSecretKey } = require("../middleware/auth");
const { User, Course, } = require("../db");
const router = express.Router();
const {signSchema} = require("../zodTypes/index");

// signup route
  router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const parsedData = signSchema.safeParse({username, password});
    if(parsedData.success){
      const user = await User.findOne({ username });
      if (user) {
        res.status(403).json({ message: 'User already exists' });
      } else {
        const newUser = new User({ username, password });
        await newUser.save();
        const token = jwt.sign({ username, role: 'user' }, userSecretKey, { expiresIn: '1h' });
        res.json({ message: 'User created successfully', token });
      }
    }else{
      res.status(400).json({message : "You sent wrong inputs!"})
    }
  });
  
  // log in route
  router.post('/login', async (req, res) => {
    const { username, password } = req.headers;
    const parsedData = signSchema.safeParse({username, password});
    if(parsedData.success){
      const user = await User.findOne({ username, password });
      if (user) {
        const token = jwt.sign({ username, role: 'user' }, userSecretKey, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
      } else {
        res.status(403).json({ message: 'Invalid username or password' });
      }
    }else{
    res.status(400).json({message : "You sent wrong inputs!"})
    }
  });
  
  // get all courses route
  router.get('/courses', authenticateUserJwt, async (req, res) => {
    const courses = await Course.find({published: true});
    res.json({ courses });
  });
  
  // purchase course route
  router.post('/courses/:courseId', authenticateUserJwt, async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    console.log(course);
    if (course) {
      const user = await User.findOne({ username: req.username });
      if (user) {
        user.purchasedCourses.push(course);
        await user.save();
        res.json({ message: 'Course purchased successfully' });
      } else {
        res.status(403).json({ message: 'User not found' });
      }
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  });
  
  // get purchase courses route
  router.get('/purchasedCourses', authenticateUserJwt, async (req, res) => {
    const user = await User.findOne({ username: req.username }).populate('purchasedCourses');
    if (user) {
      res.json({ purchasedCourses: user.purchasedCourses || [] });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  });
  
  module.exports = router