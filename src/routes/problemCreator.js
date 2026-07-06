const express = require('express');
const problemRouter = express.Router();
const adminMiddleware=require("../middleware/adminMiddleware");
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,getAllSolvedProblem,submittedproblem} = require("../controllers/userProblem");
const userMiddleware=require('../middleware/userMiddleware');

// admin level api
problemRouter.post('/create',adminMiddleware,createProblem);
problemRouter.put('/update/:id',adminMiddleware,updateProblem);
problemRouter.delete('/delete/:id',adminMiddleware,deleteProblem);


// user level api
problemRouter.get('/problemById/:id',userMiddleware,getProblemById);
problemRouter.get('/getallproblem',userMiddleware,getAllProblem);
problemRouter.get('/problemsolvedbyuser',userMiddleware,getAllSolvedProblem);
problemRouter.get('/submittedproblem/:pid',userMiddleware,submittedproblem);

module.exports=problemRouter;