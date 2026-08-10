const { User, roleHierarchy } = require('../models/User');
const Task = require('../models/Task');

exports.getUsers = async (req, res) => {
  try {
    const { assignerRole } = req.query;
    const users = await User.find().sort({ role: -1, name: 1 });

    if (!assignerRole || !roleHierarchy.hasOwnProperty(assignerRole)) {
      return res.status(200).json(users);
    }

    const assignerLevel = roleHierarchy[assignerRole];
    const filtered = users.filter(u => roleHierarchy[u.role] < assignerLevel);
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ message: 'Personnel with this email already exists' });

    const newUser = new User({ name, email, role: role || 'EMPLOYEE' });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    await Task.deleteMany({ assignedTo: userId });
    res.status(200).json({ message: 'Personnel successfully removed and queue unassigned' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};