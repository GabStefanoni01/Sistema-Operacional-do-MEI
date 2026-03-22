const STORAGE_KEY = '@mei_clients';

/**
 * Service to handle client data.
 * Currently using localStorage, but ready to be updated for .NET backend.
 */
export const clientService = {
  /**
   * Get all clients from storage
   */
  getClients: async () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Save all clients to storage
   */
  saveClients: async (clients) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  },

  /**
   * Add a new client
   */
  addClient: async (clientData) => {
    const clients = await clientService.getClients();
    const newClient = {
      id: Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      ...clientData
    };
    const updated = [newClient, ...clients];
    await clientService.saveClients(updated);
    return newClient;
  },

  /**
   * Update an existing client
   */
  updateClient: async (id, clientData) => {
    const clients = await clientService.getClients();
    const updated = clients.map(c => 
      c.id === id ? { ...c, ...clientData, updatedAt: new Date().toISOString() } : c
    );
    await clientService.saveClients(updated);
    return updated.find(c => c.id === id);
  },

  /**
   * Delete a client
   */
  deleteClient: async (id) => {
    const clients = await clientService.getClients();
    const updated = clients.filter(c => c.id !== id);
    await clientService.saveClients(updated);
    return true;
  }
};
