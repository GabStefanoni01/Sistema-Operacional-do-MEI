import React, { useState, useEffect } from 'react';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import { clientService } from './services/api';

function App() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  const [notification, setNotification] = useState(null);

  // Load clients on initial render
  useEffect(() => {
    const loadClients = async () => {
      const data = await clientService.getClients();
      setClients(data);
    };
    loadClients();
  }, []);

  const addClient = async (clientData) => {
    const newClient = await clientService.addClient(clientData);
    setClients([newClient, ...clients]);
    showNotification('Cliente salvo com sucesso!');
  };

  const updateClient = async (id, clientData) => {
    const updatedClient = await clientService.updateClient(id, clientData);
    setClients(clients.map(c => c.id === id ? updatedClient : c));
    setEditingClient(null);
    showNotification('Cliente atualizado com sucesso!');
  };

  const deleteClient = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este cliente do seu histórico?')) {
      await clientService.deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
      showNotification('Cliente removido!');
    }
  };

  const startEdit = (client) => {
    setEditingClient(client);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingClient(null);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const filteredClients = clients.filter(client => {
    const searchString = `${client.name} ${client.phone} ${client.service} ${client.address} ${client.notes}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="app-container">
      {notification && (
        <div className="notification-toast show">
          {notification}
        </div>
      )}
      
      <header className="app-header">
        <div className="logo">
          <i className="fa-solid fa-address-book"></i>
          <h1>Controle de Clientes</h1>
        </div>
        <p className="subtitle">Gerencie seus contatos e históricos de serviço facilmente.</p>
      </header>

      <main className="main-content">
        <section className="form-section">
          <ClientForm 
            onSave={editingClient ? (data) => updateClient(editingClient.id, data) : addClient}
            editingClient={editingClient}
            onCancel={cancelEdit}
          />
        </section>

        <section className="list-section">
          <div className="card">
            <div className="list-header">
              <h2><i className="fa-solid fa-users"></i> Meus Clientes</h2>
              <div className="search-box">
                <i className="fa-solid fa-search"></i>
                <input 
                  type="text" 
                  placeholder="Buscar cliente..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <ClientList 
              clients={filteredClients} 
              onEdit={startEdit} 
              onDelete={deleteClient}
              searchTerm={searchTerm}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
