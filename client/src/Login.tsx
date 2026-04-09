import React, { useState } from 'react';
import './Login.css';

type Tab = 'login' | 'create';

interface LoginProps {
  onSuccess?: (token: string, userId: string, username: string) => void;
}

export default function Login({ onSuccess }: LoginProps) {
  console.log('onSuccess prop:', onSuccess);
  const [activeTab, setActiveTab] = useState<Tab>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [createUsername, setCreateUsername] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createConfirm, setCreateConfirm] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed.');
        return;
      }

      localStorage.setItem('token', data.token);
      onSuccess?.(data.token, data.userId, data.username);
    } catch (err) {
      setError('Could not reach the server. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setError(null);
    if (!createUsername || !createEmail || !createPassword || !createConfirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (createPassword !== createConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: createUsername,
          email: createEmail,
          password: createPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        return;
      }

      localStorage.setItem('token', data.token);
      onSuccess?.(data.token, data.userId, data.username);
    } catch (err) {
      setError('Could not reach the server. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ln-stage">
      <div className="ln-wall" />
      <div className="ln-floor" />
      <div className="ln-floorLip" />
      <div className="ln-spotlight" />

      {/* Lamp */}
      <div className="ln-lampCord" />
      <div className="ln-lampShade" />
      <div className="ln-lampRim" />
      <div className="ln-lampBulb" />

      <div className="ln-card">
        <div className="ln-brand">HUES & CUES</div>

        <div className="ln-tabs">
          <button
            type="button"
            className={`ln-tab ${activeTab === 'login' ? 'isActive' : ''}`}
            onClick={() => { setActiveTab('login'); setError(null); }}
          >
            Login
          </button>
          <button
            type="button"
            className={`ln-tab ${activeTab === 'create' ? 'isActive' : ''}`}
            onClick={() => { setActiveTab('create'); setError(null); }}
          >
            Create Account
          </button>
        </div>

        <div className="ln-body">

          {activeTab === 'login' && (
            <div className="ln-form" key="login">
              <div className="ln-field">
                <label className="ln-label">Email</label>
                <input
                  type="email"
                  className="ln-input"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="email"
                />
              </div>
              <div className="ln-field">
                <label className="ln-label">Password</label>
                <input
                  type="password"
                  className="ln-input"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="current-password"
                />
              </div>
              {error && <div className="ln-error">{error}</div>}
              <button type="button" className="ln-submit" onClick={handleLogin} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="ln-form" key="create">
              <div className="ln-field">
                <label className="ln-label">Username</label>
                <input
                  type="text"
                  className="ln-input"
                  placeholder="coolplayer42"
                  value={createUsername}
                  onChange={e => setCreateUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="ln-field">
                <label className="ln-label">Email</label>
                <input
                  type="email"
                  className="ln-input"
                  placeholder="you@example.com"
                  value={createEmail}
                  onChange={e => setCreateEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="ln-field">
                <label className="ln-label">Password</label>
                <input
                  type="password"
                  className="ln-input"
                  placeholder="••••••••"
                  value={createPassword}
                  onChange={e => setCreatePassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="ln-field">
                <label className="ln-label">Confirm Password</label>
                <input
                  type="password"
                  className="ln-input"
                  placeholder="••••••••"
                  value={createConfirm}
                  onChange={e => setCreateConfirm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  autoComplete="new-password"
                />
              </div>
              {error && <div className="ln-error">{error}</div>}
              <button type="button" className="ln-submit" onClick={handleCreate} disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
