import React, { useState, useEffect } from 'react';
import { taxService } from '../services/api';

export default function TaxesPage() {
  const [taxes, setTaxes] = useState([]);
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({ 
    month: currentMonth.toString(), 
    year: currentYear.toString(), 
    amount: '75.00', 
    due_date: new Date(currentYear, currentMonth - 1, 20).toISOString().slice(0, 10), 
    status: 'pending' 
  });
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await taxService.getAll();
    setTaxes(data || []);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { 
      ...formData, 
      month: parseInt(formData.month), 
      year: parseInt(formData.year), 
      amount: parseFloat(formData.amount) 
    };

    if (editingId) {
      await taxService.update(editingId, payload);
      showNotification('Imposto atualizado!');
    } else {
      await taxService.add(payload);
      showNotification('Imposto registrado!');
    }
    resetForm();
    loadData();
  };

  const handleEdit = (tax) => {
    setFormData({
      month: tax.month.toString(),
      year: tax.year.toString(),
      amount: tax.amount,
      due_date: tax.due_date,
      status: tax.status
    });
    setEditingId(tax.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este registro de imposto?')) {
      await taxService.delete(id);
      showNotification('Registro excluído!');
      loadData();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await taxService.update(id, { status: newStatus });
    loadData();
  };

  const resetForm = () => {
    setFormData({ 
      month: currentMonth.toString(), 
      year: currentYear.toString(), 
      amount: '75.00', 
      due_date: new Date(currentYear, currentMonth - 1, 20).toISOString().slice(0, 10), 
      status: 'pending' 
    });
    setEditingId(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="client-service" style={{backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171'}}>Pendente</span>;
      case 'paid': return <span className="client-service" style={{backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399'}}>Pago</span>;
      default: return null;
    }
  };

  const getMonthName = (monthValue) => {
    const date = new Date();
    date.setMonth(monthValue - 1);
    return date.toLocaleString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase());
  };

  return (
    <div className="page-container fade-in">
      {notification && <div className="notification-toast show">{notification}</div>}

      <div className="page-header">
        <h2><i className="fa-solid fa-file-signature" /> Impostos (DAS)</h2>
        <p className="text-secondary">Controle o pagamento mensal da sua guia DAS-MEI.</p>
      </div>

      <div className="main-content">
        <section className="form-section">
          <div className="card">
            <h2>
              <i className={`fa-solid ${editingId ? 'fa-pen' : 'fa-plus'}`} />
              {editingId ? 'Editar Referência' : 'Nova Referência DAS'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Mês Referência</label>
                  <div className="input-wrapper">
                    <select
                      required
                      value={formData.month}
                      onChange={e => setFormData({ ...formData, month: e.target.value })}
                      style={{ width: '100%', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)' }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>{getMonthName(m)}</option>
                      ))}
                    </select>
                    <i className="fa-regular fa-calendar-days" style={{ zIndex: 1 }} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Ano Referência</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      required
                      min="2000"
                      max="2100"
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: e.target.value })}
                    />
                    <i className="fa-solid fa-calendar" />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valor DAS (R$)</label>
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
                  <label>Vencimento</label>
                  <div className="input-wrapper">
                    <input
                      type="date"
                      required
                      value={formData.due_date}
                      onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                      style={{ colorScheme: 'dark' }}
                    />
                    <i className="fa-solid fa-clock" />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <div className="input-wrapper">
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="pending">Pendente</option>
                    <option value="paid">Pago</option>
                  </select>
                  <i className="fa-solid fa-clipboard-check" style={{ zIndex: 1 }} />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <i className="fa-solid fa-save" /> {editingId ? 'Atualizar' : 'Salvar'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        <section className="list-section">
          <div className="card">
            <div className="list-header">
              <h2><i className="fa-solid fa-list" /> Histórico de Pagamentos</h2>
            </div>
            
            <div className="clients-container">
              {taxes.length === 0 ? (
                <div className="empty-state">
                  <i className="fa-solid fa-file-invoice empty-icon" />
                  <h3>Nenhuma guia registrada</h3>
                  <p>Inicie o controle das suas guias DAS mensais.</p>
                </div>
              ) : (
                <ul className="clients-list">
                  {taxes.sort((a,b) => {
                    const dateA = new Date(a.year, a.month - 1);
                    const dateB = new Date(b.year, b.month - 1);
                    return dateB - dateA;
                  }).map(tax => (
                    <li key={tax.id} className="client-item" style={{ borderLeft: `3px solid ${tax.status === 'paid' ? '#34D399' : '#F87171'}` }}>
                      <div className="client-header">
                        <div className="client-info">
                          <h3>{getMonthName(tax.month)} / {tax.year}</h3>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', color: '#F8FAFC' }}>R$ {Number(tax.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            {getStatusBadge(tax.status)}
                          </div>
                        </div>
                        <div className="client-actions">
                          {tax.status === 'pending' && (
                            <button className="action-btn" style={{color: '#34D399'}} onClick={() => handleStatusChange(tax.id, 'paid')} title="Marcar como Pago">
                              <i className="fa-solid fa-check" />
                            </button>
                          )}
                          {tax.status === 'paid' && (
                            <button className="action-btn" style={{color: '#F87171'}} onClick={() => handleStatusChange(tax.id, 'pending')} title="Marcar como Pendente">
                              <i className="fa-solid fa-xmark" />
                            </button>
                          )}
                          <button className="action-btn edit-btn" onClick={() => handleEdit(tax)} title="Editar">
                            <i className="fa-solid fa-pen" />
                          </button>
                          <button className="action-btn delete-btn" onClick={() => handleDelete(tax.id)} title="Excluir">
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </div>
                      <div className="client-details" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                        <div>Vencimento original: {new Date(tax.due_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
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
