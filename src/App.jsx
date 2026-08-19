import React, { useState, useEffect } from 'react';
import './App.css';
import ClockDisplay from './components/ClockDisplay';
import { countries } from './utils/timezones';

function App() {
  // Auth Mode: "signin" or "signup"
  const [authMode, setAuthMode] = useState('signin');

  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Clock State
  const [time, setTime] = useState(new Date());
  const [theme, setTheme] = useState('light');

  // Dashboard State
  const [country, setCountry] = useState('India');
  const [clockType, setClockType] = useState('digital');

  // Clock Timer — only runs when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLoggedIn]);

  // Sync theme with the document body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

// API base URL (Express server runs on port 5000)
const API_URL = "http://localhost:5000";

// Helper: call API to get users (used only for signup duplicate check)
const fetchUsers = async () => {
  try {
    const res = await fetch(`${API_URL}/api/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json(); // expects array of {username, password}
  } catch (e) {
    console.error(e);
    return [];
  }
};

// Handle Sign In (Existing User) – async
const handleSignIn = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!username.trim()) { setError('Please enter your username.'); return; }
  if (!password.trim()) { setError('Please enter your password.'); return; }

  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password })
    });
    const data = await res.json();
    if (!res.ok) { setError(data.message || 'Login failed'); return; }
    // success
    setIsLoggedIn(true);
  } catch (e) {
    setError('Network error. Please try again later.');
  }
};

// Handle Sign Up (New User) – async
const handleSignUp = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!username.trim()) { setError('Please enter a username.'); return; }
  if (username.trim().length < 3) { setError('Username must be at least 3 characters.'); return; }
  if (!password.trim()) { setError('Please enter a password.'); return; }
  if (password.trim().length < 4) { setError('Password must be at least 4 characters.'); return; }
  if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

  // Check duplicate username via API
  const users = await fetchUsers();
  const exists = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  if (exists) { setError('Username already taken. Please choose another or sign in.'); return; }

  // Send signup request
  try {
    const res = await fetch(`${API_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password })
    });
    const data = await res.json();
    if (!res.ok) { setError(data.message || 'Signup failed'); return; }
    setSuccess('Account created successfully! Please sign in.');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setAuthMode('signin');
  } catch (e) {
    setError('Network error. Please try again later.');
  }
};

// Helper: get stored users – removed (now using API)
// const getStoredUsers = () => [];
// const saveUsers = (users) => {};


  // Switch between Sign In and Sign Up modes
  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setCountry('India');
    setError('');
    setSuccess('');
  };

  return (
    <div className={`app-page ${theme}`}>
      {/* ===== NAVBAR ===== */}
      <nav className={`navbar navbar-expand-lg fixed-top ${theme === 'dark' ? 'navbar-dark glass-nav-dark' : 'navbar-light glass-nav-light'}`}>
        <div className="container">
          <span className="navbar-brand fw-bold brand-text">
            <span className="brand-icon">⏱</span> Digital Clock
          </span>
          <div className="d-flex align-items-center gap-3">
            {isLoggedIn && (
              <span className="user-pill d-none d-sm-inline-flex">
                <span className="user-avatar">{username.charAt(0).toUpperCase()}</span>
                {username}
              </span>
            )}
            <button
              className={`btn btn-sm theme-btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'}`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '☾' : '☀'}
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">

              {!isLoggedIn ? (
                /* ===== AUTH CARD ===== */
                <div className="glass-card login-card animate-fadeIn">
                  <div className="text-center mb-4">
                    <div className="lock-icon-circle mb-3">
                      {authMode === 'signin' ? '🔒' : '🆕'}
                    </div>
                    <h2 className="card-heading">
                      {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="card-subtitle">
                      {authMode === 'signin'
                        ? 'Sign in to access your world clock'
                        : 'Register a new account to get started'}
                    </p>
                  </div>

                  {/* Auth Mode Tabs */}
                  <div className="auth-tabs mb-4">
                    <button
                      className={`auth-tab ${authMode === 'signin' ? 'active' : ''}`}
                      onClick={() => switchAuthMode('signin')}
                    >
                      Existing User
                    </button>
                    <button
                      className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
                      onClick={() => switchAuthMode('signup')}
                    >
                      New User
                    </button>
                  </div>

                  {/* Error / Success Messages */}
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center py-2 px-3" role="alert">
                      <span className="me-2">⚠️</span> {error}
                    </div>
                  )}
                  {success && (
                    <div className="alert alert-success d-flex align-items-center py-2 px-3" role="alert">
                      <span className="me-2">✅</span> {success}
                    </div>
                  )}

                  <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp}>
                    {/* Username */}
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label fw-semibold">Username</label>
                      <div className="input-group custom-input-group">
                        <span className="input-group-text input-icon">👤</span>
                        <input
                          type="text"
                          className="form-control custom-input"
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-semibold">Password</label>
                      <div className="input-group custom-input-group">
                        <span className="input-group-text input-icon">🔑</span>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control custom-input"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary password-eye-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? "🙈" : "👁"}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password — only visible in Sign Up mode */}
                    {authMode === 'signup' && (
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                        <div className="input-group custom-input-group">
                          <span className="input-group-text input-icon">🔑</span>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control custom-input"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                          />
                        </div>
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold login-submit-btn mt-2">
                      {authMode === 'signin' ? 'Sign In →' : 'Create Account →'}
                    </button>
                  </form>

                  {/* Switch link */}
                  <p className="text-center mt-3 mb-0 switch-text">
                    {authMode === 'signin' ? (
                      <>Don't have an account? <button className="link-btn" onClick={() => switchAuthMode('signup')}>Sign Up</button></>
                    ) : (
                      <>Already have an account? <button className="link-btn" onClick={() => switchAuthMode('signin')}>Sign In</button></>
                    )}
                  </p>
                </div>

              ) : (
                /* ===== CLOCK DASHBOARD CARD ===== */
                <div className="glass-card clock-card animate-fadeIn">
                  {/* Country Selector */}
                  <div className="mb-4 w-100">
                    <label htmlFor="country" className="form-label fw-semibold">
                      🌍 Select Country
                    </label>
                    <select
                      className="form-select custom-select"
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      {countries.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="country-badge-pill mb-3">📍 {country} Time</div>

                  {/* Clock Type Toggle */}
                  <div className="auth-tabs mb-4 clock-toggle-tabs">
                    <button
                      className={`auth-tab ${clockType === 'digital' ? 'active' : ''}`}
                      onClick={() => setClockType('digital')}
                    >
                      <span className="me-2">12:00</span> Digital
                    </button>
                    <button
                      className={`auth-tab ${clockType === 'analog' ? 'active' : ''}`}
                      onClick={() => setClockType('analog')}
                    >
                      <span className="me-2">⏱</span> Analog
                    </button>
                  </div>

                  {/* Pass time, theme, timezone, clockType to ClockDisplay through props */}
                  <ClockDisplay 
                    time={time} 
                    theme={theme} 
                    timezone={countries.find(c => c.name === country)?.timezone || 'Asia/Kolkata'} 
                    clockType={clockType} 
                  />

                  <div className="theme-label mb-3">
                    {theme === 'light' ? '☀ Light Theme' : '☾ Dark Theme'}
                  </div>

                  <div className="d-grid gap-2 w-100">
                    <button className="btn btn-outline-danger btn-sm logout-btn" onClick={handleLogout}>
                      ← Logout
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="app-footer text-center">
        <small>Built with React + Vite &nbsp;|&nbsp; © 2026 Digital Clock App</small>
      </footer>
    </div>
  );
}

export default App;
