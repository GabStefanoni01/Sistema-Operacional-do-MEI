import React, { useState, useEffect } from 'react';
import { appointmentService, clientService, serviceService } from '../services/api';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  
  const [formData, setFormData] = useState({ client_id: '', service_id: '', date: '', status: 'scheduled', notes: '' });
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const appts = await appointmentService.getAll();
    const cls = await clientService.getClients();
    const svcs = await serviceService.getAll();
    
    setAppointments(appts || []);
    setClients(cls || []);
    setServices(svcs || []);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await appointmentService.update(editingId, formData);
      showNotification('Agendamento atualizado!');
    } else {
      await appointmentService.add(formData);
      showNotification('Agendamento salvo!');
    }
    resetForm();
    loadData();
  };

  const handleEdit = (appt) => {
    setFormData({
      client_id: appt.client_id,
      service_id: appt.service_id,
      date: new Date(appt.date).toISOString().slice(0, 16), // datetime-local format format: "YYYY-MM-DDThh:mm"
      status: appt.status,
      notes: appt.notes || ''
    });
    setEditingId(appt.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este agendamento?')) {
      await appointmentService.delete(id);
      showNotification('Agendamento excluído!');
      loadData();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await appointmentService.update(id, { status: newStatus });
    loadData();
  };

  const resetForm = () => {
    setFormData({ client_id: '', service_id: '', date: '', status: 'scheduled', notes: '' });
    setEditingId(null);
  };

  const getClientName = (id) => clients.find(c => c.id === id)?.name || 'Desconhecido';
  const getServiceName = (id) => services.find(s => s.id === id)?.name || 'Desconhecido';

  const getStatusBadge = (status) => {
    switch(status) {
      case 'scheduled': return <span className="client-service" style={{backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA'}}>Agendado</span>;
      case 'completed': return <span className="client-service" style={{backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399'}}>Concluído</span>;
      case 'canceled': return <span className="client-service" style={{backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171'}}>Cancelado</span>;
      default: return null;
    }
  };

  return (
    <div className="page-container fade-in">
      {notification && <div className="notification-toast show">{notification}</div>}

      <div className="page-header">
        <h2><i className="fa-solid fa-calendar-check" /> Agendamentos</h2>
        <p className="text-secondary">Controle sua agenda de serviços e status dos compromissos.</p>
      </div>

      <div className="main-content">
        <section className="form-section">
          <div className="card">
            <h2>
              <i className={`fa-solid ${editingId ? 'fa-pen' : 'fa-plus'}`} />
              {editingId ? 'Editar Agendamento' : 'Novo Agendamento'}
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
                <label>Serviço</label>
                <div className="input-wrapper">
                  <select
                    required
                    value={formData.service_id}
                    onChange={e => setFormData({ ...formData, service_id: e.target.value })}
                    style={{ width: '100%', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="">Selecione um serviço...</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name} (R$ {s.default_price})</option>)}
                  </select>
                  <i className="fa-solid fa-box" style={{ zIndex: 1 }} />
                </div>
              </div>

              <div className="form-group">
                <label>Data e Hora</label>
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

              <div className="form-group">
                <label>Status</label>
                <div className="input-wrapper">
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)' }}
                  >
                    <option value="scheduled">Agendado</option>
                    <option value="completed">Concluído</option>
                    <option value="canceled">Cancelado</option>
                  </select>
                  <i className="fa-solid fa-signal" style={{ zIndex: 1 }} />
                </div>
              </div>

              <div className="form-group">
                <label>Observações</label>
                <div className="input-wrapper align-top">
                  <textarea
                    placeholder="Detalhes adicionais..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  />
                  <i className="fa-solid fa-align-left" />
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
              <h2><i className="fa-solid fa-list" /> Próximos Agendamentos</h2>
            </div>
            
            <div className="clients-container">
              {appointments.length === 0 ? (
                <div className="empty-state">
                  <i className="fa-regular fa-calendar-xmark empty-icon" />
                  <h3>Nenhum agendamento</h3>
                  <p>Cadastre novos compromissos para organizá-los aqui.</p>
                </div>
              ) : (
                <ul className="clients-list">
                  {appointments.sort((a,b) => new Date(a.date) - new Date(b.date)).map(appt => (
                    <li key={appt.id} className="client-item">
                      <div className="client-header">
                        <div className="client-info">
                          <h3>{getClientName(appt.client_id)}</h3>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span className="client-service">{getServiceName(appt.service_id)}</span>
                            {getStatusBadge(appt.status)}
                          </div>
                        </div>
                        <div className="client-actions">
                          {appt.status !== 'completed' && (
                            <button className="action-btn" style={{color: '#34D399'}} onClick={() => handleStatusChange(appt.id, 'completed')} title="Marcar como Concluído">
                              <i className="fa-solid fa-check" />
                            </button>
                          )}
                          <button className="action-btn edit-btn" onClick={() => handleEdit(appt)} title="Editar">
                            <i className="fa-solid fa-pen" />
                          </button>
                          <button className="action-btn delete-btn" onClick={() => handleDelete(appt.id)} title="Excluir">
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </div>
                      <div className="client-details" style={{ marginTop: '0.5rem' }}>
                        <div className="detail-item">
                          <i className="fa-regular fa-calendar" /> {new Date(appt.date).toLocaleString('pt-BR')}
                        </div>
                      </div>
                      {appt.notes && (
                        <div className="client-notes" style={{ marginTop: '0.5rem' }}>
                          {appt.notes}
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
