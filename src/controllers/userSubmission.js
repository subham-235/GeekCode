const Problem = require("../models/problem");
const Submission = require("../models/submission");
const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

  let { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(400).send("Some field missing");
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      testCasesTotal: problem.hiddenTestCases.length,
      status: "pending",
    });

    const languageId = getLanguageById(language);

    if (!languageId) {
      return res.status(400).send("Unsupported language");
    }

    const submissions = problem.hiddenTestCases.map((testCase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultTokens = submitResult.map((result) => result.token);
    const testResults = await submitToken(resultTokens);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResults) {
      if (test.status.id === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, Number(test.memory || 0));
      } else {
        if (test.status.id === 4) {
          status = "error";
          errorMessage = test.stderr;
        } else {
          status = "wrong";
          errorMessage =
            test.stderr ||
            test.compile_output ||
            test.stdout ||
            "Wrong Answer";
        }
        break;
      }
    }

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();

    if (!req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

    // Reshape response to match what the frontend expects
    return res.status(201).json({
      accepted: status === "accepted",
      passedTestCases: testCasesPassed,
      totalTestCases: problem.hiddenTestCases.length,
      runtime,
      memory,
      error: status !== "accepted" ? errorMessage : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};


const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    const { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(400).send("Some field missing");
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    const languageId = getLanguageById(language);

    if (!languageId) {
      return res.status(400).send("Unsupported language");
    }

    const submissions = problem.visibleTestCases.map((testCase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultTokens = submitResult.map((result) => result.token);
    const testResults = await submitToken(resultTokens);

    // Determine overall success and compute aggregate stats
    let allPassed = true;
    let runtime = 0;
    let memory = 0;

    const mappedTestCases = testResults.map((test, index) => {
      const passed = test.status.id === 3;
      if (!passed) allPassed = false;
      runtime += parseFloat(test.time || 0);
      memory = Math.max(memory, Number(test.memory || 0));

      return {
        stdin: problem.visibleTestCases[index].input,
        expected_output: problem.visibleTestCases[index].output,
        stdout: test.stdout,
        status_id: test.status.id,
      };
    });

    return res.status(201).json({
      success: allPassed,
      runtime,
      memory,
      testCases: mappedTestCases,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};


module.exports = { submitCode, runCode };