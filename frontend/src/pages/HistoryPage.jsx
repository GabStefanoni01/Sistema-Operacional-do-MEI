import React, { useState, useEffect } from 'react';
import { historyService, clientService } from '../services/api';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({ client_id: '', service_name: '', price: '', date: new Date().toISOString().slice(0, 16), notes: '' });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const hist = await historyService.getAll();
    const cls = await clientService.getClients();
    setHistory(hist || []);
    setClients(cls || []);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await historyService.add(formData);
    showNotification('Serviço adicionado ao histórico!');
    setFormData({ client_id: '', service_name: '', price: '', date: new Date().toISOString().slice(0, 16), notes: '' });
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este registro do histórico?')) {
      await historyService.delete(id);
      showNotification('Registro excluído!');
      loadData();
    }
  };

  const getClientName = (id) => clients.find(c => c.id === id)?.name || 'Desconhecido';

  const filteredHistory = history.filter(h => {
    const clientName = getClientName(h.client_id).toLowerCase();
    const serviceName = h.service_name.toLowerCase();
    const search = searchTerm.toLowerCase();
    return clientName.includes(search) || serviceName.includes(search);
  });

  return (
    <div className="page-container fade-in">
      {notification && <div className="notification-toast show">{notification}</div>}

      <div className="page-header">
        <h2><i className="fa-solid fa-clock-rotate-left" /> Histórico de Serviços</h2>
        <p className="text-secondary">Registre e consulte serviços finalizados.</p>
      </div>

      <div className="main-content">
        <section className="form-section">
          <div className="card">
            <h2><i className="fa-solid fa-plus" /> Inserir Manualmente</h2>
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
                    <option value="">Selecione...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <i className="fa-solid fa-user" style={{ zIndex: 1 }} />
                </div>
              </div>

              <div className="form-group">
                <label>Nome do Serviço</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    required
                    placeholder="Ex: Instalação de Sistema"
                    value={formData.service_name}
                    onChange={e => setFormData({ ...formData, service_name: e.target.value })}
                  />
                  <i className="fa-solid fa-tag" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valor Cobrado (R$)</label>
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
                  <label>Data</label>
                  <div className="input-wrapper">
                    <input
                      type="datetime-local"
                      required
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      style={{ colorScheme: 'dark' }}
                    />
                    <i className="fa-regular fa-clock" />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Observações</label>
                <div className="input-wrapper align-top">
                  <textarea
                    placeholder="Detalhes..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  />
                  <i className="fa-solid fa-align-left" />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <i className="fa-solid fa-save" /> Registrar
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="list-section">
          <div className="card">
            <div className="list-header">
              <h2><i className="fa-solid fa-list" /> Serviços Realizados</h2>
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
              {filteredHistory.length === 0 ? (
                <div className="empty-state">
                  <i className="fa-solid fa-box-open empty-icon" />
                  <h3>Nenhum histórico</h3>
                  <p>Inicie os registros de serviços finalizados.</p>
                </div>
              ) : (
                <ul className="clients-list">
                  {filteredHistory.sort((a,b) => new Date(b.date) - new Date(a.date)).map(item => (
                    <li key={item.id} className="client-item">
                      <div className="client-header">
                        <div className="client-info">
                          <h3>{item.service_name}</h3>
                          <span className="client-service">Cliente: {getClientName(item.client_id)}</span>
                        </div>
                        <div className="client-actions">
                          <button className="action-btn delete-btn" onClick={() => handleDelete(item.id)} title="Excluir">
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </div>
                      <div className="client-details" style={{ marginTop: '0.5rem' }}>
                        <div className="detail-item">
                          <i className="fa-regular fa-calendar" /> {new Date(item.date).toLocaleString('pt-BR')}
                        </div>
                        <div className="detail-item" style={{ color: '#34D399', fontWeight: 'bold' }}>
                          <i className="fa-solid fa-money-bill" /> R$ {Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      {item.notes && (
                        <div className="client-notes" style={{ marginTop: '0.5rem' }}>
                          {item.notes}
                        </div>
                      )}
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
