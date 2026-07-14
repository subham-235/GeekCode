const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");

const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      starterCode,
      referenceSolution,
    } = req.body;

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      if (!languageId) {
        return res.status(400).json({
          message: `Unsupported language: ${language}`,
        });
      }

      const submissions = visibleTestCases.map((testCase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output,
      }));

      const submitResult = await submitBatch(submissions);
      const resultToken = submitResult.map((result) => result.token);
      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id !== 3) {
          return res.status(400).json({
            message: `${language} reference solution failed on visible test cases.`,
            error: test,
          });
        }
      }
    }

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      starterCode,
      referenceSolution,
      problemCreator: req.result._id,
    });
    res.status(201).json({
      message: "Problem created successfully.",
      problem,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create problem.",
      error: err.message,
    });
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).send("Missing Id...");
    }

    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      starterCode,
      referenceSolution,
    } = req.body;

    const DSAProblem = await Problem.findById(id);
    if (!DSAProblem) {
      return res.status(404).send("Problem not found");
    }

    if (!Array.isArray(referenceSolution) || !Array.isArray(visibleTestCases)) {
      return res
        .status(400)
        .send("referenceSolution and visibleTestCases are required");
    }

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      if (!languageId) {
        return res.status(400).json({
          message: `Unsupported language: ${language}`,
        });
      }

      const submissions = visibleTestCases.map((testCase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output,
      }));

      const submitResult = await submitBatch(submissions);
      const resultToken = submitResult.map((result) => result.token);
      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id !== 3) {
          return res.status(400).json({
            message: `${language} reference solution failed on visible test cases.`,
            error: test,
          });
        }
      }
    }

    const newProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true },
    );

    res.status(200).send(newProblem);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).send("Missing Id...");
    }

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) {
      return res.status(404).send("Problem not Available...");
    }
    res.status(200).send("deletedProblem");
  } catch (err) {
    res.status(404).send("Error : " + err);
  }
};

const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).send("Missing Id...");
    }

    const getProblem = await Problem.findById(id).select(
      "title description difficulty tags visibleTestCases starterCode referenceSolution _id",
    );

    if (!getProblem) {
      return res.status(404).send("Problem not Available...");
    }

    const videos = await SolutionVideo.findOne({ problemId: id });

    // Convert to a plain JS object so ad-hoc fields actually get sent
    const responseProblem = getProblem.toObject();

    if (videos) {
      responseProblem.secureUrl = videos.secureUrl;
      responseProblem.cloudinaryPublicId = videos.cloudinaryPublicId;
      responseProblem.thumbnailUrl = videos.thumbnailUrl;
      responseProblem.duration = videos.duration;
    }

    return res.status(200).send(responseProblem);
  } catch (err) {
    res.status(404).send("Error : " + err);
  }
};

const getAllProblem = async (req, res) => {
  try {
    const getProblem = await Problem.find({}).select(
      "_id title difficulty tags",
    );

    if (getProblem.length == 0) {
      return res.status(404).send("Problem not Available...");
    }
    res.status(200).send(getProblem);
  } catch (err) {
    res.status(404).send("Error : " + err);
  }
};

const getAllSolvedProblem = async (req, res) => {
  try {
    const userId1 = req.result._id;
    const user1 = await User.findById(userId1).populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });

    res.status(200).send(user1.problemSolved);
  } catch (err) {
    res.status(500).send("Server Error...");
  }
};

const submittedproblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;

    const ans = await Submission.find({ userId, problemId });
    if (ans.length === 0) {
      res.status(200).json({ submissions: allSubmissions });
    }
    return res.status(200).send(ans);
  } catch (err) {
    return res.status(500).send("Internal Server Error!!!");
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  getAllSolvedProblem,
  submittedproblem,
};
