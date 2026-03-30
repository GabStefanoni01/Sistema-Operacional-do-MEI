import React, { useState, useEffect } from 'react';
import { budgetService, clientService } from '../services/api';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({ client_id: '', description: '', price: '', status: 'pending' });
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const bdgs = await budgetService.getAll();
    const cls = await clientService.getClients();
    setBudgets(bdgs || []);
    setClients(cls || []);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await budgetService.update(editingId, { ...formData, price: parseFloat(formData.price) });
      showNotification('Orçamento atualizado!');
    } else {
      await budgetService.add({ ...formData, price: parseFloat(formData.price) });
      showNotification('Orçamento criado!');
    }
    resetForm();
    loadData();
  };

  const handleEdit = (bdg) => {
    setFormData({
      client_id: bdg.client_id,
      description: bdg.description,
      price: bdg.price,
      status: bdg.status
    });
    setEditingId(bdg.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este orçamento?')) {
      await budgetService.delete(id);
      showNotification('Orçamento excluído!');
      loadData();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await budgetService.update(id, { status: newStatus });
    loadData();
  };

  const resetForm = () => {
    setFormData({ client_id: '', description: '', price: '', status: 'pending' });
    setEditingId(null);
  };

  const getClientName = (id) => clients.find(c => c.id === id)?.name || 'Desconhecido';

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="client-service" style={{backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24'}}>Pendente</span>;
      case 'approved': return <span className="client-service" style={{backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399'}}>Aprovado</span>;
      case 'rejected': return <span className="client-service" style={{backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171'}}>Rejeitado</span>;
      default: return null;
    }
  };

  const filteredBudgets = budgets.filter(b => {
    const clientName = getClientName(b.client_id).toLowerCase();
    const desc = b.description.toLowerCase();
    const search = searchTerm.toLowerCase();
    return clientName.includes(search) || desc.includes(search);
  });

  return (
    <div className="page-container fade-in">
      {notification && <div className="notification-toast show">{notification}</div>}

      <div className="page-header">
        <h2><i className="fa-solid fa-file-invoice-dollar" /> Orçamentos</h2>
        <p className="text-secondary">Crie e gerencie os orçamentos enviados aos clientes.</p>
      </div>

      <div className="main-content">
        <section className="form-section">
          <div className="card">
            <h2>
              <i className={`fa-solid ${editingId ? 'fa-pen' : 'fa-plus'}`} />
              {editingId ? 'Editar Orçamento' : 'Novo Orçamento'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Cliente</label>
                <div className="input-wrapper">
                  <select
                    required
                    value={formData.client_id}
                    onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                    style={{ width: '100%', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="">Selecione um cliente...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <i className="fa-solid fa-user" style={{ zIndex: 1 }} />
                </div>
              </div>

              <div className="form-group">
                <label>Descrição do Orçamento</label>
                <div className="input-wrapper align-top">
                  <textarea
                    required
                    placeholder="Descreva os serviços, materiais, etc..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                  <i className="fa-solid fa-align-left" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valor Total (R$)</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                    />
                    <i className="fa-solid fa-dollar-sign" />
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
                      <option value="approved">Aprovado</option>
                      <option value="rejected">Rejeitado</option>
                    </select>
                    <i className="fa-solid fa-clipboard-check" style={{ zIndex: 1 }} />
                  </div>
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
              <h2><i className="fa-solid fa-list" /> Lista de Orçamentos</h2>
              <div className="search-box">
                <i className="fa-solid fa-search" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="clients-container">
              {filteredBudgets.length === 0 ? (
                <div className="empty-state">
                  <i className="fa-solid fa-folder-open empty-icon" />
                  <h3>Nenhum orçamento</h3>
                  <p>Inicie a criação de orçamentos para seus clientes.</p>
                </div>
              ) : (
                <ul className="clients-list">
                  {filteredBudgets.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(bdg => (
                    <li key={bdg.id} className="client-item" style={{ borderLeft: `3px solid ${bdg.status === 'approved' ? '#34D399' : bdg.status === 'rejected' ? '#F87171' : '#FBBF24'}` }}>
                      <div className="client-header">
                        <div className="client-info">
                          <h3>{getClientName(bdg.client_id)}</h3>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', color: '#F8FAFC' }}>R$ {Number(bdg.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            {getStatusBadge(bdg.status)}
                          </div>
                        </div>
                        <div className="client-actions">
                          {bdg.status === 'pending' && (
                            <>
                              <button className="action-btn" style={{color: '#34D399'}} onClick={() => handleStatusChange(bdg.id, 'approved')} title="Aprovar">
                                <i className="fa-solid fa-check" />
                              </button>
                              <button className="action-btn" style={{color: '#F87171'}} onClick={() => handleStatusChange(bdg.id, 'rejected')} title="Rejeitar">
                                <i className="fa-solid fa-xmark" />
                              </button>
                            </>
                          )}
                          <button className="action-btn edit-btn" onClick={() => handleEdit(bdg)} title="Editar">
                            <i className="fa-solid fa-pen" />
                          </button>
                          <button className="action-btn delete-btn" onClick={() => handleDelete(bdg.id)} title="Excluir">
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </div>
                      <div className="client-notes" style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                        {bdg.description}
                      </div>
                      <div className="client-details" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                        <div>Criado em: {new Date(bdg.createdAt).toLocaleDateString('pt-BR')}</div>
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
