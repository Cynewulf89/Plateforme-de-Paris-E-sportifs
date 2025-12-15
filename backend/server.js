const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('Starting server...');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 5000;

console.log(`Server will listen on port ${PORT}`);
console.log('Environment:', process.env.NODE_ENV);
console.log('Setting up middleware...');

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, allow specific origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://hwokgc8woogwwco48kg88skg.31.220.75.92.sslip.io',
      /\.31\.220\.75\.92\.sslip\.io$/
    ];
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      } else {
        return allowed.test(origin);
      }
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Handle preflight requests
app.options('*', cors(corsOptions));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

console.log('Setting up data directory...');

const dataPath = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);

// Helper function to read/write users
const getUsers = () => {
  try {
    const filePath = path.join(dataPath, 'users.json');
    if (!fs.existsSync(filePath)) {
      console.log('Creating users.json file with default users');
      const defaultUsers = [
        { id: 1, email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin' },
        { id: 2, email: 'test@example.com', password: 'password123', role: 'user', name: 'Test User' }
      ];
      fs.writeFileSync(filePath, JSON.stringify(defaultUsers, null, 2));
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
};

const saveUsers = (users) => {
  try {
    fs.writeFileSync(path.join(dataPath, 'users.json'), JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users.json:', error);
  }
};

// Middleware d'autorisation
const requireAuth = (req, res, next) => {
  // Simulation basique - en production, vérifier le token JWT
  // Pour l'instant, on permet toutes les requêtes authentifiées côté client
  console.log('Authorization check - allowing request');
  next();
};

const requireAdmin = (req, res, next) => {
  // Simulation basique - en production, vérifier le rôle depuis le token
  // Pour l'instant, on permet toutes les requêtes (mais côté client on vérifie le rôle)
  console.log('Admin authorization check - allowing request');
  next();
};

// Auth routes
app.post('/auth/register', (req, res) => {
  console.log('=== REGISTER REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', req.body);
  console.log('Origin:', req.headers.origin);
  
  try {
    console.log('Registration attempt:', req.body);
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      console.log('Missing fields');
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const users = getUsers();
    console.log('Current users count:', users.length);

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      console.log('User already exists');
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const newUser = {
      id: Date.now(),
      email,
      password, // In production, hash the password!
      name,
      role: 'user', // Default role for new registrations
      balance: 1000, // Initial balance
      mode: 'demo', // Default mode
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    console.log('User registered successfully');

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

app.post('/auth/login', (req, res) => {
  console.log('=== LOGIN REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', req.body);
  console.log('Origin:', req.headers.origin);
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }

  // Ensure balance exists
  if (!user.balance) {
    user.balance = 1000;
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      saveUsers(users);
    }
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Routes for user management (admin only)
app.get('/users', requireAdmin, (req, res) => {
  try {
    const users = getUsers();
    // Return users without passwords
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

app.put('/users/:id/role', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id == id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    users[userIndex].role = role;
    saveUsers(users);

    // Return user without password
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Update user balance
app.put('/users/:id/balance', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { balance } = req.body;

    if (typeof balance !== 'number' || balance < 0) {
      return res.status(400).json({ message: 'Solde invalide' });
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id == id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    users[userIndex].balance = balance;
    saveUsers(users);

    // Emit real-time update
    io.emit('balanceUpdated', { userId: id, balance: users[userIndex].balance });

    // Return user without password
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user balance:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Update user mode
app.put('/users/:id/mode', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { mode } = req.body;

    if (!['demo', 'real'].includes(mode)) {
      return res.status(400).json({ message: 'Mode invalide' });
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id == id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    users[userIndex].mode = mode;
    if (mode === 'demo') {
      users[userIndex].balance = 1000;
    }
    saveUsers(users);

    // Return user without password
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user mode:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Routes for teams
app.get('/teams', (req, res) => {
  try {
    console.log('GET /api/teams called');
    let teams = [];
    try {
      teams = JSON.parse(fs.readFileSync(path.join(dataPath, 'teams.json'), 'utf8'));
    } catch (error) {
      console.log('teams.json not found, starting with empty array');
    }
    console.log('Teams loaded:', teams.length);
    res.json(teams);
  } catch (error) {
    console.error('Error reading teams:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

app.post('/teams', requireAdmin, (req, res) => {
  try {
    console.log('POST /api/teams called - Admin operation');
    const { name, logo, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Le nom de l\'équipe est requis' });
    }

    let teams = [];
    try {
      teams = JSON.parse(fs.readFileSync(path.join(dataPath, 'teams.json'), 'utf8'));
    } catch (error) {
      console.log('teams.json not found, starting with empty array');
    }
    const newTeam = {
      id: Date.now().toString(),
      name,
      logo: logo || '',
      description: description || ''
    };

    teams.push(newTeam);
    fs.writeFileSync(path.join(dataPath, 'teams.json'), JSON.stringify(teams, null, 2));

    console.log('Team created:', newTeam.name);
    res.json(newTeam);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

app.delete('/teams/:id', requireAdmin, (req, res) => {
  try {
    console.log('DELETE /api/teams called - Admin operation');
    const teamId = req.params.id;

    const teams = JSON.parse(fs.readFileSync(path.join(dataPath, 'teams.json'), 'utf8') || '[]');
    const filteredTeams = teams.filter(team => team.id !== teamId);

    if (filteredTeams.length === teams.length) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }

    fs.writeFileSync(path.join(dataPath, 'teams.json'), JSON.stringify(filteredTeams, null, 2));

    console.log('Team deleted:', teamId);
    res.json({ message: 'Équipe supprimée' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Routes for matches
app.get('/matches', (req, res) => {
  try {
    console.log('GET /api/matches called');
    let matches = [];
    try {
      matches = JSON.parse(fs.readFileSync(path.join(dataPath, 'matches.json'), 'utf8'));
    } catch (error) {
      console.log('matches.json not found, starting with empty array');
    }
    console.log('Matches loaded:', matches.length);
    const originalLength = matches.length;
    
    // Ensure demo matches are always present
    const demoMatches = [
      {
        id: 'demo1',
        team1: 'Paris Phoenix',
        team2: 'Lyon Lions',
        date: '2025-12-20T19:00:00Z',
        status: 'upcoming',
        odds: { team1: 2.0, team2: 2.0 },
        tournament: 'Demo Tournament'
      },
      {
        id: 'demo2',
        team1: 'Marseille Sharks',
        team2: 'Toulouse Tigers',
        date: '2025-12-21T21:00:00Z',
        status: 'upcoming',
        odds: { team1: 1.8, team2: 2.2 },
        tournament: 'Demo Tournament'
      },
      {
        id: 'demo-finished1',
        team1: 'Paris Phoenix',
        team2: 'Lyon Lions',
        date: '2025-12-11T19:00:00Z',
        status: 'finished',
        tournament: 'Demo Tournament'
      },
      {
        id: 'demo-finished2',
        team1: 'Marseille Sharks',
        team2: 'Toulouse Tigers',
        date: '2025-12-10T21:00:00Z',
        status: 'finished',
        tournament: 'Demo Tournament'
      }
    ];
    
    demoMatches.forEach(demo => {
      if (!matches.find(m => m.id === demo.id)) {
        matches.push(demo);
      }
    });
    
    // Generate random odds and results
    matches.forEach(match => {
      // Always generate random odds
      const odds1 = Math.round((1 + Math.random() * 74) * 10) / 10; // 1.0 to 75.0
      const odds2 = Math.round((1 + Math.random() * 74) * 10) / 10;
      match.odds = { team1: odds1, team2: odds2 };
      
      // For finished matches, generate random result if not present
      if (match.status === 'finished') {
        if (!match.result) {
          match.result = Math.random() < 0.5 ? 'team1' : 'team2';
        }
        if (!match.score) {
          const score1 = Math.floor(Math.random() * 4); // 0-3
          const score2 = Math.floor(Math.random() * 4);
          match.score = `${score1}-${score2}`;
        }
        if (!match.winner) {
          match.winner = match.result === 'team1' ? match.team1 : match.team2;
        }
      }
    });
    
    // Save if modified
    if (matches.length > originalLength) {
      fs.writeFileSync(path.join(dataPath, 'matches.json'), JSON.stringify(matches, null, 2));
    }
    
    res.json(matches);
  } catch (error) {
    console.error('Error reading matches:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

app.post('/matches', requireAdmin, (req, res) => {
  try {
    console.log('POST /api/matches called - Admin operation');
    const { team1, team2, date, tournament } = req.body;

    if (!team1 || !team2 || !date) {
      return res.status(400).json({ message: 'Équipe 1, Équipe 2 et date sont requis' });
    }

    const matches = JSON.parse(fs.readFileSync(path.join(dataPath, 'matches.json'), 'utf8') || '[]');
    const newMatch = {
      id: Date.now().toString(),
      team1,
      team2,
      date,
      status: 'upcoming',
      tournament: tournament || 'Ligue principale',
      odds: { team1: 2.0, team2: 2.0 }
    };

    matches.push(newMatch);
    fs.writeFileSync(path.join(dataPath, 'matches.json'), JSON.stringify(matches, null, 2));

    console.log('Match created:', `${newMatch.team1} vs ${newMatch.team2}`);
    res.json(newMatch);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

app.put('/matches/:id', requireAdmin, (req, res) => {
  try {
    console.log('PUT /api/matches called - Admin operation');
    const matchId = req.params.id;
    const updates = req.body;

    const matches = JSON.parse(fs.readFileSync(path.join(dataPath, 'matches.json'), 'utf8') || '[]');
    const matchIndex = matches.findIndex(match => match.id === matchId);

    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }

    const oldMatch = { ...matches[matchIndex] };
    matches[matchIndex] = { ...matches[matchIndex], ...updates };
    fs.writeFileSync(path.join(dataPath, 'matches.json'), JSON.stringify(matches, null, 2));

    // Emit real-time update
    io.emit('matchUpdated');

    // If status changed to finished, resolve bets
    if (oldMatch.status !== 'finished' && matches[matchIndex].status === 'finished') {
      const bets = JSON.parse(fs.readFileSync(path.join(dataPath, 'bets.json'), 'utf8') || '[]');
      const users = JSON.parse(fs.readFileSync(path.join(dataPath, 'users.json'), 'utf8') || '[]');

      const matchBets = bets.filter(b => b.matchId == matchId && !b.resolved);
      matchBets.forEach(bet => {
        const user = users.find(u => u.id == bet.userId);
        if (user) {
          if (bet.prediction === matches[matchIndex].result) {
            const gain = bet.amount * bet.odds;
            user.balance += gain;
            bet.status = 'won';
          } else {
            bet.status = 'lost';
          }
          bet.resolved = true;
        }
      });

      fs.writeFileSync(path.join(dataPath, 'bets.json'), JSON.stringify(bets, null, 2));
      fs.writeFileSync(path.join(dataPath, 'users.json'), JSON.stringify(users, null, 2));

      // Emit real-time updates for affected users
      matchBets.forEach(bet => {
        io.emit('balanceUpdated', { userId: bet.userId, balance: users.find(u => u.id == bet.userId).balance });
      });
    }

    console.log('Match updated:', matchId);
    res.json(matches[matchIndex]);
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

app.delete('/matches/:id', requireAdmin, (req, res) => {
  try {
    console.log('DELETE /api/matches called - Admin operation');
    const matchId = req.params.id;

    const matches = JSON.parse(fs.readFileSync(path.join(dataPath, 'matches.json'), 'utf8') || '[]');
    const filteredMatches = matches.filter(match => match.id !== matchId);

    if (filteredMatches.length === matches.length) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }

    fs.writeFileSync(path.join(dataPath, 'matches.json'), JSON.stringify(filteredMatches, null, 2));

    console.log('Match deleted:', matchId);
    res.json({ message: 'Match supprimé' });
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Routes for bets
app.get('/bets', (req, res) => {
  try {
    let bets = [];
    try {
      bets = JSON.parse(fs.readFileSync(path.join(dataPath, 'bets.json'), 'utf8'));
    } catch (error) {
      console.log('bets.json not found, starting with empty array');
    }
    res.json(bets);
  } catch (error) {
    console.error('Error reading bets:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

app.post('/bets', (req, res) => {
  try {
    let bets = [];
    try {
      bets = JSON.parse(fs.readFileSync(path.join(dataPath, 'bets.json'), 'utf8'));
    } catch (error) {
      console.log('bets.json not found, starting with empty array');
    }
    const newBet = {
      id: Date.now(),
      ...req.body,
      status: 'pending',
      resolved: false,
      createdAt: new Date().toISOString()
    };
    bets.push(newBet);
    fs.writeFileSync(path.join(dataPath, 'bets.json'), JSON.stringify(bets, null, 2));
    res.json(newBet);
  } catch (error) {
    console.error('Error creating bet:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Resolve bets for finished matches
app.post('/resolve-bets', requireAuth, (req, res) => {
  try {
    let bets = [];
    try {
      bets = JSON.parse(fs.readFileSync(path.join(dataPath, 'bets.json'), 'utf8'));
    } catch (error) {
      console.log('bets.json not found');
    }
    let matches = [];
    try {
      matches = JSON.parse(fs.readFileSync(path.join(dataPath, 'matches.json'), 'utf8'));
    } catch (error) {
      console.log('matches.json not found');
    }
    let users = [];
    try {
      users = JSON.parse(fs.readFileSync(path.join(dataPath, 'users.json'), 'utf8'));
    } catch (error) {
      console.log('users.json not found');
    }

    // For each finished match, resolve bets
    const affectedUsers = new Set();
    matches.forEach(match => {
      if (match.status === 'finished' && match.result && !match.resolved) {
        const matchBets = bets.filter(b => b.matchId == match.id && !b.resolved);
        matchBets.forEach(bet => {
          const user = users.find(u => u.id == bet.userId);
          if (user) {
            if (bet.prediction === match.result) {
              // Win
              const gain = bet.amount * bet.odds;
              user.balance += gain;
              bet.status = 'won';
            } else {
              // Loss
              bet.status = 'lost';
            }
            bet.resolved = true;
            affectedUsers.add(bet.userId);
          }
        });
        match.resolved = true; // Mark match as resolved to avoid re-processing
      }
    });

    fs.writeFileSync(path.join(dataPath, 'bets.json'), JSON.stringify(bets, null, 2));
    fs.writeFileSync(path.join(dataPath, 'users.json'), JSON.stringify(users, null, 2));
    fs.writeFileSync(path.join(dataPath, 'matches.json'), JSON.stringify(matches, null, 2));

    // Emit updates for affected users
    affectedUsers.forEach(userId => {
      const user = users.find(u => u.id == userId);
      if (user) {
        io.emit('betsResolved', { userId });
        io.emit('balanceUpdated', { userId, newBalance: user.balance });
      }
    });

    res.json({ message: 'Bets resolved' });
  } catch (error) {
    console.error('Error resolving bets:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // process.exit(1); // Commented out to prevent server termination
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // process.exit(1); // Commented out to prevent server termination
});

console.log('About to start listening on port', PORT);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Server started successfully');
  console.log('Server is now listening for connections...');
});