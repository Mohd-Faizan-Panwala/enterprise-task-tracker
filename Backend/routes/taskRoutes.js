const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, taskController.getTasks);
router.post('/', protect, taskController.createTask);
router.put('/:id', protect, taskController.updateTask);
router.patch('/:id/status', protect, taskController.updateTaskStatus);
router.delete('/:id', protect, taskController.deleteTask);

module.exports = router;