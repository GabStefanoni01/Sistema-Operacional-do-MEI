import React, { useState, useEffect } from 'react';
import { serviceService } from '../services/api';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ name: '', default_price: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await serviceService.getAll();
    setServices(data || []);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await serviceService.update(editingId, formData);
      showNotification('Serviço atualizado!');
    } else {
      await serviceService.add(formData);
      showNotification('Serviço cadastrado!');
    }
    setFormData({ name: '', default_price: '' });
    setEditingId(null);
    loadServices();
  };

  const handleEdit = (svc) => {
    setFormData({ name: svc.name, default_price: svc.default_price });
    setEditingId(svc.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      await serviceService.delete(id);
      showNotification('Serviço removido!');
      loadServices();
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container fade-in">
      {notification && <div className="notification-toast show">{notification}</div>}

      <div className="page-header">
        <h2><i className="fa-solid fa-box" /> Serviços Oferecidos</h2>
        <p className="text-secondary">Gerencie os serviços que você presta e seus preços padrão.</p>
      </div>

      <div className="main-content">
        {/* Form Section */}
        <section className="form-section">
          <div className="card">
            <h2>
              <i className={`fa-solid ${editingId ? 'fa-pen' : 'fa-plus'}`} />
              {editingId ? 'Editar Serviço' : 'Novo Serviço'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome do Serviço</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    required
                    placeholder="Ex: Formatação de Computador"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  <i className="fa-solid fa-tag" />
                </div>
              </div>
              <div className="form-group">
                <label>Preço Padrão (R$)</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 150.00"
                    value={formData.default_price}
                    onChange={e => setFormData({ ...formData, default_price: e.target.value })}
                  />
                  <i className="fa-solid fa-dollar-sign" />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <i className="fa-solid fa-save" /> {editingId ? 'Atualizar' : 'Salvar'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ name: '', default_price: '' }); }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* List Section */}
        <section className="list-section">
          <div className="card">
            <div className="list-header">
              <h2><i className="fa-solid fa-list" /> Lista de Serviços</h2>
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
              {filteredServices.length === 0 ? (
                <div className="empty-state">
                  <i className="fa-solid fa-box-open empty-icon" />
                  <h3>Nenhum serviço encontrado</h3>
                  <p>Cadastre seu primeiro serviço ao lado.</p>
                </div>
              ) : (
                <ul className="clients-list">
                  {filteredServices.map(svc => (
                    <li key={svc.id} className="client-item">
                      <div className="client-header" style={{ marginBottom: 0 }}>
                        <div className="client-info">
                          <h3>{svc.name}</h3>
                          <span className="client-service">
                            R$ {Number(svc.default_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="client-actions">
                          <button className="action-btn edit-btn" onClick={() => handleEdit(svc)} title="Editar">
                            <i className="fa-solid fa-pen" />
                          </button>
                          <button className="action-btn delete-btn" onClick={() => handleDelete(svc.id)} title="Excluir">
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
