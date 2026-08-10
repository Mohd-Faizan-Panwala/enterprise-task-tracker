const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const { User } = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware (MUST be declared before routes)
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Auto-Seeder with Hashed Passwords
async function seedDefaultWorkspace() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      await User.insertMany([
        { name: 'Eleanor Vance', role: 'BOSS', email: 'boss@company.com', password: hashedPassword },
        { name: 'Marcus Sterling', role: 'GM', email: 'gm@company.com', password: hashedPassword },
        { name: 'Sarah Jenkins', role: 'MANAGER', email: 'manager@company.com', password: hashedPassword },
        { name: 'David Chen', role: 'TL', email: 'tl@company.com', password: hashedPassword },
        { name: 'Alex Rivera', role: 'EMPLOYEE', email: 'alex@company.com', password: hashedPassword },
        { name: 'Emily Watson', role: 'EMPLOYEE', email: 'emily@company.com', password: hashedPassword }
      ]);
      console.log('✅ Enterprise default personnel roster seeded with hashed passwords');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}

// 🛠️ TEMPORARY RESET ROUTE
app.get('/api/force-reset', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    
    // 1. Delete all existing users
    await User.deleteMany({});
    
    // 2. Create hashed password
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    
    // 3. Re-insert fresh accounts with passwords
    await User.insertMany([
      { name: 'Eleanor Vance', role: 'BOSS', email: 'boss@company.com', password: hashedPassword },
      { name: 'Marcus Sterling', role: 'GM', email: 'gm@company.com', password: hashedPassword },
      { name: 'Sarah Jenkins', role: 'MANAGER', email: 'manager@company.com', password: hashedPassword },
      { name: 'David Chen', role: 'TL', email: 'tl@company.com', password: hashedPassword },
      { name: 'Alex Rivera', role: 'EMPLOYEE', email: 'alex@company.com', password: hashedPassword },
      { name: 'Emily Watson', role: 'EMPLOYEE', email: 'emily@company.com', password: hashedPassword }
    ]);
    
    res.status(200).send('✅ Database successfully reset and seeded with passwords!');
  } catch (err) {
    res.status(500).send('Error resetting database: ' + err.message);
  }
});
mongoose.connection.once('open', seedDefaultWorkspace);

// Mount Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Server Startup
app.listen(PORT, () => {
  console.log(`🚀 Enterprise Task Engine active on http://localhost:${PORT}`);
});