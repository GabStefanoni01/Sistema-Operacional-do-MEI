import React, { useState, useEffect } from 'react';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';

const STORAGE_KEY = '@mei_clients';

function App() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClient, setEditingClient] = useState(null);

  // Load clients on initial render
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setClients(JSON.parse(stored));
    }
  }, []);

  // Save clients whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  const addClient = (clientData) => {
    const newClient = {
      id: Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      ...clientData
    };
    setClients([newClient, ...clients]);
    showNotification('Cliente salvo com sucesso!');
  };

  const updateClient = (id, clientData) => {
    setClients(clients.map(c => 
      c.id === id ? { ...c, ...clientData, updatedAt: new Date().toISOString() } : c
    ));
    setEditingClient(null);
    showNotification('Cliente atualizado com sucesso!');
  };

  const deleteClient = (id) => {
    if (window.confirm('Tem certeza que deseja remover este cliente do seu histórico?')) {
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
    const toast = document.createElement('div');
    toast.textContent = message;
    
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'var(--success-color)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-lg)',
        zIndex: '9999',
        transform: 'translateY(100px)',
        opacity: '0',
        transition: 'all 0.3s ease-out'
    });
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const filteredClients = clients.filter(client => {
    const searchString = `${client.name} ${client.phone} ${client.service} ${client.address} ${client.notes}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="app-container">
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
