import express from 'express';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

// Define your user-related routes here
userRouter.get('/data', userAuth, (req, res) => {

});