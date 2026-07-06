const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middleware/userMiddleware");

const router = express.Router();

router.get('/google', passport.authenticate("google", { scope: ['profile', 'email'] }));

router.get("/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        try {
            const token = jwt.sign(
                {
                    _id: req.user._id,
                    emailId: req.user.emailId,
                    role: req.user.role
                },
                process.env.JWT_KEY,
                { expiresIn: 60 * 60 }
            );
            res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
        } catch (error) {
            console.error("Google login error", error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
        }
    }
);

router.get("/me", userMiddleware, (req, res) => {
    res.json({ success: true, user: req.user });
});

module.exports = router;