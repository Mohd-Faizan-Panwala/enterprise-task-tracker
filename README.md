# Role-Based Task Management System

A full-stack, enterprise-grade task and workforce management application with strict hierarchical role privileges, cloud database persistence, and a fully responsive mobile-first UI.

---

## 🚀 Tech Stack
* **Frontend:** React, Tailwind CSS, Lucide React Icons
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Cloud NoSQL) with Mongoose ODM

---

## ✨ Key Features
* **Hierarchical Role Access:** Strict enforcement of rank levels (BOSS > GM > MANAGER > TL > EMPLOYEE). Supervisors cannot see or assign tasks to higher-level executives.
* **Workforce Management:** Managers and Team Leaders can onboard new subordinates or remove existing team members directly.
* **Advanced Task Management:** Create, track, edit, reassign, and filter tasks across the entire team in real-time.
* **Fully Responsive:** Optimized UI that adapts seamlessly to mobile devices, tablets, and desktops.

---

## 🛠️ Installation & Setup

### 1. Clone & Install Dependencies
```powershell
# Install backend dependencies
npm install --prefix Backend/server

# Install frontend dependencies (if not already done)
