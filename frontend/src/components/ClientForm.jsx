import React, { useState, useEffect } from 'react';

function ClientForm({ onSave, editingClient, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    if (editingClient) {
      setFormData({
        name: editingClient.name,
        phone: editingClient.phone,
        service: editingClient.service,
        address: editingClient.address,
        notes: editingClient.notes || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        service: '',
        address: '',
        notes: ''
      });
    }
  }, [editingClient]);

  const handlePhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 10) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }
    
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    if (!editingClient) {
      setFormData({ name: '', phone: '', service: '', address: '', notes: '' });
    }
  };

  return (
    <div className="card glass-effect">
      <h2><i className={`fa-solid ${editingClient ? 'fa-pen' : 'fa-user-plus'}`}></i> {editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h2>
      <form id="clientForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="clientName">Nome Completo</label>
          <div className="input-wrapper">
            <i className="fa-regular fa-user"></i>
            <input 
              type="text" 
              id="clientName" 
              placeholder="Ex: João Silva" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="clientPhone">Telefone / WhatsApp</label>
            <div className="input-wrapper">
              <i className="fa-brands fa-whatsapp"></i>
              <input 
                type="tel" 
                id="clientPhone" 
                placeholder="(11) 90000-0000" 
                required 
                value={formData.phone}
                onChange={handlePhoneInput}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="clientService">Tipo de Serviço</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-wrench"></i>
              <input 
                type="text" 
                id="clientService" 
                placeholder="Ex: Instalação de tomada" 
                required 
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="clientAddress">Endereço</label>
          <div className="input-wrapper">
            <i className="fa-solid fa-location-dot"></i>
            <input 
              type="text" 
              id="clientAddress" 
              placeholder="Ex: Rua X, Ipiranga - SP" 
              required 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="clientNotes">Observações</label>
          <div className="input-wrapper align-top">
            <i className="fa-regular fa-comment-dots"></i>
            <textarea 
              id="clientNotes" 
              rows="3" 
              placeholder="Informações adicionais relevantes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            ></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" id="saveBtn">
            <span className="btn-text">{editingClient ? 'Atualizar Cliente' : 'Salvar Cliente'}</span>
            <i className={`fa-solid ${editingClient ? 'fa-pen' : 'fa-check'}`}></i>
          </button>
          {editingClient && (
            <button type="button" className="btn btn-secondary" id="cancelBtn" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ClientForm;
