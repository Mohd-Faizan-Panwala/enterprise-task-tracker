const Task = require('../models/Task');
const { User, roleHierarchy } = require('../models/User');

exports.getTasks = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID parameter is required' });

    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: 'User session not found' });

    const isSupervisor = roleHierarchy[currentUser.role] > 0;
    const query = isSupervisor ? {} : { assignedTo: currentUser._id };

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name role email')
      .populate('assignedBy', 'name role email')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo, assignedBy } = req.body;
    if (!title || !assignedTo || !assignedBy) {
      return res.status(400).json({ message: 'Missing required task parameters' });
    }

    const supervisor = await User.findById(assignedBy);
    const targetEmployee = await User.findById(assignedTo);

    if (!supervisor || !targetEmployee) {
      return res.status(404).json({ message: 'Assigner or Target employee not found' });
    }

    if (roleHierarchy[targetEmployee.role] >= roleHierarchy[supervisor.role]) {
      return res.status(403).json({ message: 'Access Denied: Cannot assign tasks to equal or higher corporate roles' });
    }

    const taskId = `TSK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTask = new Task({
      taskId,
      title,
      description,
      priority: priority || 'MEDIUM',
      assignedTo: targetEmployee._id,
      assignedBy: supervisor._id
    });

    await newTask.save();
    const populatedTask = await Task.findById(newTask._id)
      .populate('assignedTo', 'name role email')
      .populate('assignedBy', 'name role email');

    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo, status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, priority, assignedTo, status },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name role email')
      .populate('assignedBy', 'name role email');

    if (!updatedTask) return res.status(404).json({ message: 'Task item not found' });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('assignedTo', 'name role email').populate('assignedBy', 'name role email');

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task purged from queue successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};