const USERS_STORAGE_KEY = 'novatask_users_v1';
const CURRENT_USER_KEY = 'novatask_current_user_v1';
const TASKS_STORAGE_KEY = 'novatask_tasks_v1';

// Seed demo tasks for a fresh user
export function generateSeedTasks(userId) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const inThreeDays = new Date(now);
  inThreeDays.setDate(inThreeDays.getDate() + 3);
  const inThreeDaysStr = inThreeDays.toISOString().split('T')[0];

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  return [
    {
      id: `task_${Date.now()}_1`,
      userId,
      title: 'Review SaaS system architecture & API design',
      description: 'Audit the GraphQL & REST endpoints, ensure JWT rotation and rate limiting are configured.',
      completed: false,
      priority: 'high',
      category: 'development',
      dueDate: todayStr,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: `task_${Date.now()}_2`,
      userId,
      title: 'Finalize Dark Glassmorphic 3D Landing Page',
      description: 'Tweak glowing Three.js floating orbs, ensure mobile performance 60fps and smooth animations.',
      completed: true,
      priority: 'urgent',
      category: 'design',
      dueDate: todayStr,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: `task_${Date.now()}_3`,
      userId,
      title: 'Schedule Q3 sprint roadmap sync with engineering team',
      description: 'Prepare presentation deck highlighting feature milestones, technical debt reduction, and deployment targets.',
      completed: false,
      priority: 'medium',
      category: 'work',
      dueDate: tomorrowStr,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: `task_${Date.now()}_4`,
      userId,
      title: 'Prepare product demo recording for angel investors',
      description: 'Capture high-res screen walkthrough emphasizing real-time state sync, responsive layout, and UI polish.',
      completed: false,
      priority: 'high',
      category: 'work',
      dueDate: inThreeDaysStr,
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: `task_${Date.now()}_5`,
      userId,
      title: 'Weekly 5km jog & evening wellness routine',
      description: 'Hydrate, stretch, and disconnect for 45 minutes outdoors.',
      completed: true,
      priority: 'low',
      category: 'personal',
      dueDate: yesterdayStr,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
  ];
}

// User Auth LocalStorage Service
export const authStorage = {
  getUsers() {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  ensureDemoUserExists() {
    const users = this.getUsers();
    const demoEmail = 'alex.founder@novatask.io';
    if (!users[demoEmail]) {
      const uid = 'usr_demo_founder_99';
      const now = new Date().toISOString();
      const demoUser = {
        uid,
        email: demoEmail,
        displayName: 'Alex Morgan',
        createdAt: now,
        lastLoginAt: now,
      };
      users[demoEmail] = {
        user: demoUser,
        passwordHash: btoa('password123'),
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      taskStorage.saveTasksForUser(uid, generateSeedTasks(uid));
    }
  },

  getCurrentUser() {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  signup(email, password, displayName) {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users[normalizedEmail]) {
      throw new Error('An account with this email already exists.');
    }

    const name = displayName?.trim() || normalizedEmail.split('@')[0];
    const uid = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const now = new Date().toISOString();

    const newUser = {
      uid,
      email: normalizedEmail,
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      createdAt: now,
      lastLoginAt: now,
    };

    users[normalizedEmail] = {
      user: newUser,
      passwordHash: btoa(password),
    };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    this.setCurrentUser(newUser);

    // Populate initial seed tasks
    taskStorage.saveTasksForUser(uid, generateSeedTasks(uid));

    return { user: newUser };
  },

  login(email, password) {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const record = users[normalizedEmail];

    if (!record) {
      throw new Error('No account found with this email address.');
    }

    if (record.passwordHash !== btoa(password)) {
      throw new Error('Invalid password. Please try again.');
    }

    const updatedUser = {
      ...record.user,
      lastLoginAt: new Date().toISOString(),
    };

    users[normalizedEmail].user = updatedUser;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    this.setCurrentUser(updatedUser);

    const existingTasks = taskStorage.getTasksForUser(updatedUser.uid);
    if (existingTasks.length === 0) {
      taskStorage.saveTasksForUser(updatedUser.uid, generateSeedTasks(updatedUser.uid));
    }

    return { user: updatedUser };
  },

  logout() {
    this.setCurrentUser(null);
  },
};

// Tasks LocalStorage Service
export const taskStorage = {
  getAllTasksMap() {
    try {
      const data = localStorage.getItem(TASKS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  getTasksForUser(userId) {
    const map = this.getAllTasksMap();
    return map[userId] || [];
  },

  saveTasksForUser(userId, tasks) {
    const map = this.getAllTasksMap();
    map[userId] = tasks;
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(map));
  },

  addTask(userId, taskData) {
    const tasks = this.getTasksForUser(userId);
    const now = new Date().toISOString();
    const newTask = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newTask, ...tasks];
    this.saveTasksForUser(userId, updated);
    return newTask;
  },

  updateTask(userId, taskId, updates) {
    const tasks = this.getTasksForUser(userId);
    const updated = tasks.map((t) =>
      t.id === taskId
        ? { ...t, ...updates, updatedAt: new Date().toISOString() }
        : t
    );
    this.saveTasksForUser(userId, updated);
    return updated;
  },

  deleteTask(userId, taskId) {
    const tasks = this.getTasksForUser(userId);
    const updated = tasks.filter((t) => t.id !== taskId);
    this.saveTasksForUser(userId, updated);
    return updated;
  },

  toggleComplete(userId, taskId) {
    const tasks = this.getTasksForUser(userId);
    let isCompleted = false;
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        isCompleted = !t.completed;
        return {
          ...t,
          completed: isCompleted,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    this.saveTasksForUser(userId, updated);
    return { updatedTasks: updated, isCompleted };
  },
};
