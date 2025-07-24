"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
const router = (0, express_1.Router)();
// Get rating by user ID
router.get("/users/ratings", middleware_1.authenticateToken, controllers_1.RatingController.getRatingByUserId);
// Get rating by movie ID
router.get("/movies/:movieId/ratings", (0, middleware_1.validateRequestSchema)(schema_1.getRatingByMovieSchema), controllers_1.RatingController.getRatingByMovie);
// Create a rating
router.post("/movies/:movieId/ratings", middleware_1.authenticateToken, (0, middleware_1.validateRequestSchema)(schema_1.createRatingSchema), controllers_1.RatingController.createRating);
// Update a rating
router.put("/ratings/:ratingId", middleware_1.authenticateToken, (0, middleware_1.validateRequestSchema)(schema_1.updateRatingSchema), controllers_1.RatingController.updateRating);
exports.default = router;
