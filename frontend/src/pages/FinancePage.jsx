import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/api';

export default function FinancePage() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ type: 'income', amount: '', description: '', date: new Date().toISOString().slice(0, 10) });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await transactionService.getAll();
    setTransactions(data || []);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await transactionService.add({ ...formData, amount: parseFloat(formData.amount) });
    showNotification('Transação registrada!');
    setFormData({ type: 'income', amount: '', description: '', date: new Date().toISOString().slice(0, 10) });
    loadTransactions();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir esta transação?')) {
      await transactionService.delete(id);
      showNotification('Transação excluída!');
      loadTransactions();
    }
  };

  const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;

  const formatCurrency = (val) => Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="page-container fade-in">
      {notification && <div className="notification-toast show">{notification}</div>}

      <div className="page-header">
        <h2><i className="fa-solid fa-money-bill-trend-up" /> Controle Financeiro</h2>
        <p className="text-secondary">Acompanhe suas receitas, despesas e fluxo de caixa.</p>
      </div>

      {/* Resumo Financeiro */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '4px solid #34D399' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="fa-solid fa-arrow-trend-up" />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Receitas</p>
            <h3 style={{ fontSize: '1.5rem', color: '#F8FAFC' }}>{formatCurrency(income)}</h3>
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '4px solid #F87171' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', color: '#F87171', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="fa-solid fa-arrow-trend-down" />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Despesas</p>
            <h3 style={{ fontSize: '1.5rem', color: '#F8FAFC' }}>{formatCurrency(expense)}</h3>
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: `4px solid ${balance >= 0 ? '#3B82F6' : '#F87171'}` }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: balance >= 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: balance >= 0 ? '#60A5FA' : '#F87171', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="fa-solid fa-wallet" />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Saldo Atual</p>
            <h3 style={{ fontSize: '1.5rem', color: '#F8FAFC' }}>{formatCurrency(balance)}</h3>
          </div>
        </div>
      </div>

      <div className="main-content">
        <section className="form-section">
          <div className="card">
            <h2><i className="fa-solid fa-plus" /> Nova Transação</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tipo de Transação</label>
                <div className="input-wrapper">
                  <select
                    required
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="income">Receita (Entrada)</option>
                    <option value="expense">Despesa (Saída)</option>
                  </select>
                  <i className="fa-solid fa-right-left" style={{ zIndex: 1 }} />
                </div>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    required
                    placeholder="Ex: Compra de material"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                  <i className="fa-solid fa-align-left" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valor (R$)</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    />
                    <i className="fa-solid fa-dollar-sign" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Data</label>
                  <div className="input-wrapper">
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      style={{ colorScheme: 'dark' }}
                    />
                    <i className="fa-regular fa-calendar" />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" style={{ background: formData.type === 'income' ? '#10B981' : '#EF4444', borderColor: formData.type === 'income' ? '#059669' : '#DC2626' }}>
                  <i className="fa-solid fa-save" /> Registrar {formData.type === 'income' ? 'Receita' : 'Despesa'}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="list-section">
          <div className="card">
            <div className="list-header">
              <h2><i className="fa-solid fa-list-ul" /> Extrato</h2>
            </div>
            <div className="clients-container">
              {transactions.length === 0 ? (
                <div className="empty-state">
                  <i className="fa-solid fa-receipt empty-icon" />
                  <h3>Nenhuma transação</h3>
                </div>
              ) : (
                <ul className="clients-list">
                  {transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map(t => (
                    <li key={t.id} className="client-item" style={{ borderLeft: `3px solid ${t.type === 'income' ? '#34D399' : '#F87171'}` }}>
                      <div className="client-header" style={{ marginBottom: 0 }}>
                        <div className="client-info">
                          <h3 style={{ fontSize: '1rem' }}>{t.description}</h3>
                          <span className="text-secondary" style={{ fontSize: '0.8rem' }}>
                            <i className="fa-regular fa-calendar" /> {new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                          </span>
                        </div>
                        <div className="client-actions" style={{ alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontWeight: 'bold', color: t.type === 'income' ? '#34D399' : '#F87171' }}>
                            {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                          </span>
                          <button className="action-btn delete-btn" onClick={() => handleDelete(t.id)} title="Excluir">
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
