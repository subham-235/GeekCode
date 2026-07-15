const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get('/google', passport.authenticate("google", { scope: ['profile', 'email'] }));

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` }),
  (req, res) => {
    try {
      const token = jwt.sign(
        {
          _id: req.user._id,
          emailId: req.user.emailId,
          role: req.user.role,
          provider: "google"       // <-- the key addition
        },
        process.env.JWT_KEY,
        { expiresIn: 60 * 60 }
      );

      res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
      res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
      console.error("Google login error", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
    }
  }
);

module.exports = router;