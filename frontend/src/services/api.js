// Using localStorage to mock full database interactions per entity for now
const generateId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

// Generic function generator for localStorage CRUD
function createCrudService(keyName) {
  const getItems = async () => {
    const stored = localStorage.getItem(keyName);
    return stored ? JSON.parse(stored) : [];
  };

  const saveItems = async (items) => {
    localStorage.setItem(keyName, JSON.stringify(items));
  };

  return {
    getAll: getItems,
    add: async (data) => {
      const items = await getItems();
      const newItem = { id: generateId(), createdAt: new Date().toISOString(), ...data };
      await saveItems([newItem, ...items]);
      return newItem;
    },
    update: async (id, data) => {
      const items = await getItems();
      const updated = items.map(item => item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item);
      await saveItems(updated);
      return updated.find(item => item.id === id);
    },
    delete: async (id) => {
      const items = await getItems();
      await saveItems(items.filter(item => item.id !== id));
      return true;
    }
  };
}

// Client Service mapping (keeping original method names for backwards compatibility with ClientList)
const baseClientService = createCrudService('@mei_clients');
export const clientService = {
  getClients: baseClientService.getAll,
  addClient: baseClientService.add,
  updateClient: baseClientService.update,
  deleteClient: baseClientService.delete
};

// New Services Exported
export const serviceService = createCrudService('@mei_services');
export const appointmentService = createCrudService('@mei_appointments');
export const historyService = createCrudService('@mei_history');
export const transactionService = createCrudService('@mei_transactions');
export const budgetService = createCrudService('@mei_budgets');
export const taxService = createCrudService('@mei_taxes');
