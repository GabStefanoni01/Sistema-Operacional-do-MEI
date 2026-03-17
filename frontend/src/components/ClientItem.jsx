import React from 'react';

function ClientItem({ client, onEdit, onDelete }) {
  const date = new Date(client.createdAt).toLocaleDateString('pt-BR');

  return (
    <li className="client-item">
      <div className="client-header">
        <div className="client-info">
          <h3><i className="fa-regular fa-user"></i> {client.name}</h3>
          <span className="client-service">{client.service}</span>
        </div>
        <div className="client-actions">
          <button 
            className="action-btn edit-btn" 
            onClick={() => onEdit(client)} 
            title="Editar"
          >
            <i className="fa-solid fa-pen"></i>
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={() => onDelete(client.id)} 
            title="Excluir"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
      
      <div className="client-details">
        <div className="detail-item">
          <i className="fa-brands fa-whatsapp"></i>
          <span>{client.phone}</span>
        </div>
        <div className="detail-item">
          <i className="fa-regular fa-calendar"></i>
          <span>{date}</span>
        </div>
        <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
          <i className="fa-solid fa-location-dot"></i>
          <span>{client.address}</span>
        </div>
      </div>
      
      {client.notes && (
        <div className="client-notes">
          <strong>Obs:</strong> {client.notes}
        </div>
      )}
    </li>
  );
}

export default ClientItem;
