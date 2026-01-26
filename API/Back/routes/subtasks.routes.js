const express = require("express");
const router = express.Router();
const { z } = require('zod');
const subTaskController = require("../controllers/subtasks.controller");
const { validateBody, validateParams } = require('../validators/validation.middleware');
const { SubtaskSchema, MongoIdSchema } = require('../validators/schemas.validator');

router.post("/:id/sousTaches", 
  validateParams(z.object({ id: MongoIdSchema })),
  validateBody(SubtaskSchema), 
  subTaskController.createSubtask
);

router.put("/:id/sousTaches/:sid", 
  validateParams(z.object({ id: MongoIdSchema, sid: MongoIdSchema })),
  validateBody(SubtaskSchema), 
  subTaskController.updateSubtask
);

router.delete("/:id/sousTaches/:sid", 
  validateParams(z.object({ id: MongoIdSchema, sid: MongoIdSchema })),
  subTaskController.deleteSubtask
);

module.exports = router;
