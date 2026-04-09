import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './BoardScreen.css'
import './Login.css'
import './GameScreen.css'
import Login from './Login';

createRoot(document.getElementById('root')!).render(
  <Login
    onLogin={(email, password) => console.log('login:', email, password)}
    onCreate={(username, email, password) => console.log('create:', username, email, password)}
  />
);

/*
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)*/