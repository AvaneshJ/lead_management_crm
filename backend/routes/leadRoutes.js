const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

router.route("/").post(createLead).get(getLeads);

router.route("/:id").put(updateLead).delete(deleteLead);

module.exports = router;
