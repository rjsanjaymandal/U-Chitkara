const express = require("express");
const router = express.Router();

// Import the Controllers
const { executeCode, codeLimiter } = require("../controllers/CodeExecution");

// Import Middlewares
const { auth } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Code Execution routes
// ********************************************************************************************************

// Execute code route (with rate limiting)
router.post("/execute", auth, codeLimiter, executeCode);

module.exports = router;
