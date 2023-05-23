const express = require("express");
const app = express();

const teacherRoutes = require('./teacher-api')
const studentRoutes = require('./student-api')
const adminRoutes = require('./admin-api')
const hodRoutes = require('./hod-api')
const branchRoutes = require('./branch-api')
const sectionRoutes = require('./section-api')
const taskRoutes = require('./task-api')

// ADMIN ROUTES
app.use('/admin', adminRoutes)

// TEACHER ROUTES
app.use('/teacher', teacherRoutes)

// STUDENT ROUTES
app.use('/student', studentRoutes)

// HOD ROUTES
app.use('/hod', hodRoutes)

// Branch Routes
app.use('/branch', branchRoutes)

// Section Routes
app.use('/section', sectionRoutes)

// Task Routes.
app.use('/task', taskRoutes)

module.exports = app;