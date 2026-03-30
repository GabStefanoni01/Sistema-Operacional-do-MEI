import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const { login, register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');

  // Login form
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  // Register form
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  // Se já está autenticado, redireciona
  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(loginData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    const result = await register(registerData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setError('');
  };

  return (
    <div className="auth-page">
      {/* Orbs decorativos de fundo */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <i className="fa-solid fa-address-book" />
          </div>
          <div>
            <h1 className="auth-title">MEI Manager</h1>
            <p className="auth-subtitle">Controle de Clientes</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
            type="button"
          >
            Criar conta
          </button>
          <div className={`auth-tab-indicator ${tab === 'register' ? 'right' : ''}`} />
        </div>

        {/* Formulários */}
        <div className="auth-forms">
          {/* Login */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="auth-form" key="login">
              <div className="form-group">
                <label htmlFor="login-email">E-mail</label>
                <div className="input-wrapper">
                  <input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    autoComplete="email"
                    value={loginData.email}
                    onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))}
                  />
                  <i className="fa-solid fa-envelope" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Senha</label>
                <div className="input-wrapper">
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    value={loginData.password}
                    onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                  />
                  <i className="fa-solid fa-lock" />
                </div>
              </div>

              {error && (
                <div className="auth-error">
                  <i className="fa-solid fa-triangle-exclamation" />
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-auth" disabled={loading}>
                {loading
                  ? <><span className="spinner" /> Entrando...</>
                  : <><i className="fa-solid fa-right-to-bracket" /> Entrar</>
                }
              </button>
            </form>
          )}

          {/* Register */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="auth-form" key="register">
              <div className="form-group">
                <label htmlFor="reg-name">Nome completo</label>
                <div className="input-wrapper">
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="Seu nome"
                    required
                    autoComplete="name"
                    value={registerData.name}
                    onChange={e => setRegisterData(p => ({ ...p, name: e.target.value }))}
                  />
                  <i className="fa-solid fa-user" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">E-mail</label>
                <div className="input-wrapper">
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    autoComplete="email"
                    value={registerData.email}
                    onChange={e => setRegisterData(p => ({ ...p, email: e.target.value }))}
                  />
                  <i className="fa-solid fa-envelope" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-password">Senha</label>
                <div className="input-wrapper">
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={registerData.password}
                    onChange={e => setRegisterData(p => ({ ...p, password: e.target.value }))}
                  />
                  <i className="fa-solid fa-lock" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm">Confirmar senha</label>
                <div className="input-wrapper">
                  <input
                    id="reg-confirm"
                    type="password"
                    placeholder="Repita a senha"
                    required
                    autoComplete="new-password"
                    value={registerData.confirmPassword}
                    onChange={e => setRegisterData(p => ({ ...p, confirmPassword: e.target.value }))}
                  />
                  <i className="fa-solid fa-shield-halved" />
                </div>
              </div>

              {error && (
                <div className="auth-error">
                  <i className="fa-solid fa-triangle-exclamation" />
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-auth" disabled={loading}>
                {loading
                  ? <><span className="spinner" /> Criando conta...</>
                  : <><i className="fa-solid fa-user-plus" /> Criar conta</>
                }
              </button>
            </form>
          )}
        </div>

        <p className="auth-footer">
          {tab === 'login'
            ? <>Não tem conta? <button className="auth-link" onClick={() => switchTab('register')}>Cadastre-se</button></>
            : <>Já tem conta? <button className="auth-link" onClick={() => switchTab('login')}>Entrar</button></>
          }
        </p>
      </div>
    </div>
  );
}
