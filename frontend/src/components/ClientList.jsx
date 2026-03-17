import React from 'react';
import ClientItem from './ClientItem';

function ClientList({ clients, onEdit, onDelete, searchTerm }) {
  if (clients.length === 0) {
    return (
      <div className="clients-container">
        <div id="emptyState" className="empty-state">
          <div className="empty-icon">
            <i className={`fa-solid ${searchTerm ? 'fa-search' : 'fa-folder-open'}`}></i>
          </div>
          <h3>{searchTerm ? 'Nenhum resultado' : 'Nenhum cliente cadastrado'}</h3>
          <p>
            {searchTerm 
              ? `Não encontramos clientes para "${searchTerm}".` 
              : 'Os clientes que você cadastrar aparecerão aqui.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="clients-container">
      <ul id="clientsList" className="clients-list">
        {clients.map(client => (
          <ClientItem 
            key={client.id} 
            client={client} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </ul>
    </div>
  );
}

export default ClientList;
