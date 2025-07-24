"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
const router = (0, express_1.Router)();
router.post("/signup", schema_1.signUpSchema, middleware_1.validateRequestSchema, controllers_1.UserController.signUp);
router.post("/login", schema_1.loginSchema, middleware_1.validateRequestSchema, controllers_1.UserController.login);
// ROUTE UPDATE PROFILE
router.put("/profile", middleware_1.authenticateToken, schema_1.updateProfileSchema, middleware_1.validateRequestSchema, controllers_1.UserController.updateProfile);
// Route GET PROFILE
router.get("/profile", middleware_1.authenticateToken, middleware_1.validateRequestSchema, controllers_1.UserController.getProfile);
exports.default = router;
