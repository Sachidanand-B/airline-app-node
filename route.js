const express = require("express");

const middleware = require("./middleware");
const router = express.Router();

router.get("/", middleware.getAirLineData);

router.post("/user", middleware.postUserData);

router.get("/passengers/:id", middleware.getPassengersData);

router.post('/passengers/checkedIn', middleware.postCheckedInData);

module.exports = router;