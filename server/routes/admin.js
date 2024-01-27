const express = require('express');
const { Course, Admin } = require("../db");
const jwt = require('jsonwebtoken');
const {authenticateAdminJwt, adminSecretKey} = require("../middleware/auth");
const router = express.Router();
const {signSchema} = require("../zodTypes/index");

// me/landing page route
  router.get("/me", authenticateAdminJwt, async (req, res) => {
    const admin = await Admin.findOne({ username: req.username });
    if (!admin) {
      res.status(403).json({msg: "Admin doesnt exist"})
      return
    }
    res.json({
        username: admin.username
    })
});

// signup route
  router.post('/signup', (req, res) => {    
    const { username, password } = req.body;
    const parsedData = signSchema.safeParse({username, password})
    if(parsedData.success){
      function callback(admin) {
        if (admin) {
          res.status(403).json({ message: 'Admin already exists' });
        } else {
          const obj = { username: username, password: password };
          const newAdmin = new Admin(obj);
          newAdmin.save();
  
          const token = jwt.sign({ username, role: 'admin' }, adminSecretKey, { expiresIn: '1h' });
          res.json({ message: 'Admin created successfully', token });
        }
    
      }
      Admin.findOne({ username }).then(callback);
    }else{
      res.status(400).json({message : "You sent wrong inputs!"})
    }
  });
  
  // login route
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const parsedData = signSchema.safeParse({username, password});
    if(parsedData.success){
      const admin = await Admin.findOne({ username, password });
      if (admin) {
        const token = jwt.sign({ username, role: 'admin' }, adminSecretKey, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
      } else {
        res.status(403).json({ message: 'Invalid username or password' });
      }
    }else{
      res.status(400).json({message : "You sent wrong inputs!"})
    } 
  });
  
  // create course route
  router.post('/courses', authenticateAdminJwt, async (req, res) => {
    const course = new Course(req.body);
    await course.save();
    res.json({ message: 'Course created successfully', courseId: course.id });
  });
  
  // update course route
  router.put('/courses/:courseId', authenticateAdminJwt, async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
      res.json({ message: 'Course updated successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  });
  
  // get courses route
  router.get('/courses', authenticateAdminJwt, async (req, res) => {
    const courses = await Course.find({});
    res.json({ courses });
  });
  
  // get specific course route
  router.get('/course/:courseId', authenticateAdminJwt, async (req, res) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    res.json({ course });
  });

  module.exports = router