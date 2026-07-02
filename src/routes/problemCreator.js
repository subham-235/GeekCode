const express = require('express');
const problemRouter = express.Router();
const adminMiddleware=require("../middleware/adminMiddleware");
const createProblem = require("../controllers/userProblem");

problemRouter.post('/create',adminMiddleware,createProblem);
// problemRouter.patch('/:id',adminMiddleware,updateProblem);
// problemRouter.delete('/:id',adminMiddleware,deleteProblem);


// problemRouter.get('/:id',getProblemById);
// problemRouter.get('/',getAllProblem);
// problemRouter.get('/user',solvedProblemByUser);


module.exports=problemRouter;