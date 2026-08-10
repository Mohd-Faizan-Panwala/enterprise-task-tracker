const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const roleHierarchy = { BOSS: 4, GM: 3, MANAGER: 2, TL: 1, EMPLOYEE: 0 };

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: Object.keys(roleHierarchy), default: 'EMPLOYEE' },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = { User, roleHierarchy };