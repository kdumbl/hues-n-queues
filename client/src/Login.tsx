import React, { useState } from 'react';
import './Login.css';

type Tab = 'login' | 'create';

interface LoginProps {
  onLogin?: (email: string, password: string) => void;
  onCreate?: (username: string, email: string, password: string) => void;
}

export default function Login({ onLogin, onCreate }: LoginProps) {
  const [activeTab, setActiveTab] = useState<Tab>('login');

  //login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  //acct fields
  const [createUsername, setCreateUsername] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createConfirm, setCreateConfirm] = useState('');

  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setError(null);
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields.');
      return;
    }
    onLogin?.(loginEmail, loginPassword);
  };

  const handleCreate = () => {
    setError(null);
    if (!createUsername || !createEmail || !createPassword || !createConfirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (createPassword !== createConfirm) {
      setError('Passwords do not match.');
      return;
    }
    onCreate?.(createUsername, createEmail, createPassword);
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

        {/*tabs that switch between thee screens :3*/}
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

        {/* Panel body */}
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
              <button type="button" className="ln-submit" onClick={handleLogin}>
                Sign In
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
              <button type="button" className="ln-submit" onClick={handleCreate}>
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
