const express = require("express");
const router = express.Router();
const subTaskController = require("../controllers/subtasks.controller");

router.post("/:id/sousTaches", subTaskController.createSubtask);
router.put("/:id/sousTaches/:sid", subTaskController.updateSubtask);
router.delete("/:id/sousTaches/:sid", subTaskController.deleteSubtask);

module.exports = router;
