/**
 * Sistema de Cadastro de Clientes - LocalStorage
 */

// DOM Elements
const clientForm = document.getElementById('clientForm');
const clientIdInput = document.getElementById('clientId');
const clientNameInput = document.getElementById('clientName');
const clientPhoneInput = document.getElementById('clientPhone');
const clientServiceInput = document.getElementById('clientService');
const clientAddressInput = document.getElementById('clientAddress');
const clientNotesInput = document.getElementById('clientNotes');
const clientsList = document.getElementById('clientsList');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');

// Storage Key
const STORAGE_KEY = '@mei_clients';

// Default mock data array shown in prompt for reference:
// João Silva - Instalação de tomada - Mora no Ipiranga
let clients = [];

// Initialize app
function init() {
    loadClients();
    setupEventListeners();
    renderClients();
}

// Load data from LocalStorage
function loadClients() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        clients = JSON.parse(stored);
    }
}

// Save data to LocalStorage
function saveClients() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

// Set up event listeners
function setupEventListeners() {
    clientForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    searchInput.addEventListener('input', handleSearch);
    
    // Format phone number as typing (simple mask)
    clientPhoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }
        if (value.length > 10) {
            value = `${value.slice(0, 10)}-${value.slice(10)}`;
        }
        
        e.target.value = value;
    });
}

// Handle Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = clientIdInput.value;
    const clientData = {
        name: clientNameInput.value.trim(),
        phone: clientPhoneInput.value.trim(),
        service: clientServiceInput.value.trim(),
        address: clientAddressInput.value.trim(),
        notes: clientNotesInput.value.trim()
    };
    
    if (id) {
        // Edit existing
        const index = clients.findIndex(c => c.id === id);
        if (index !== -1) {
            clients[index] = { ...clients[index], ...clientData, updatedAt: new Date().toISOString() };
        }
    } else {
        // Create new
        const newClient = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...clientData
        };
        // Add to beginning of array
        clients.unshift(newClient);
    }
    
    saveClients();
    renderClients();
    resetForm();
    showNotification(id ? 'Cliente atualizado com sucesso!' : 'Cliente salvo com sucesso!');
}

// Delete Client
function deleteClient(id) {
    if (confirm('Tem certeza que deseja remover este cliente do seu histórico?')) {
        clients = clients.filter(c => c.id !== id);
        saveClients();
        renderClients();
        showNotification('Cliente removido!');
    }
}

// Edit Client (Load data to form)
function editClient(id) {
    const client = clients.find(c => c.id === id);
    if (client) {
        clientIdInput.value = client.id;
        clientNameInput.value = client.name;
        clientPhoneInput.value = client.phone;
        clientServiceInput.value = client.service;
        clientAddressInput.value = client.address;
        clientNotesInput.value = client.notes;
        
        // Change UI state
        saveBtn.querySelector('.btn-text').textContent = 'Atualizar Cliente';
        saveBtn.querySelector('i').className = 'fa-solid fa-pen';
        cancelBtn.style.display = 'inline-flex';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Reset Form
function resetForm() {
    clientForm.reset();
    clientIdInput.value = '';
    
    // Change UI state back
    saveBtn.querySelector('.btn-text').textContent = 'Salvar Cliente';
    saveBtn.querySelector('i').className = 'fa-solid fa-check';
    cancelBtn.style.display = 'none';
}

// Handle Search functionality
function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    renderClients(term);
}

// Render Clients List
function renderClients(searchTerm = '') {
    // Clear list
    clientsList.innerHTML = '';
    
    // Filter array if search term exists
    const filteredClients = clients.filter(client => {
        const searchString = `${client.name} ${client.phone} ${client.service} ${client.address} ${client.notes}`.toLowerCase();
        return searchString.includes(searchTerm);
    });
    
    // Show/hide empty state
    if (filteredClients.length === 0) {
        emptyState.style.display = 'block';
        clientsList.style.display = 'none';
        
        if (searchTerm) {
            emptyState.querySelector('h3').textContent = 'Nenhum resultado';
            emptyState.querySelector('p').textContent = `Não encontramos clientes para "${searchTerm}".`;
        } else {
            emptyState.querySelector('h3').textContent = 'Nenhum cliente cadastrado';
            emptyState.querySelector('p').textContent = 'Os clientes que você cadastrar aparecerão aqui.';
        }
    } else {
        emptyState.style.display = 'none';
        clientsList.style.display = 'flex';
        
        // Inject DOM elements
        filteredClients.forEach(client => {
            const li = document.createElement('li');
            li.className = 'client-item';
            
            // Format dates
            const date = new Date(client.createdAt).toLocaleDateString('pt-BR');
            
            li.innerHTML = `
                <div class="client-header">
                    <div class="client-info">
                        <h3><i class="fa-regular fa-user"></i> ${escapeHTML(client.name)}</h3>
                        <span class="client-service">${escapeHTML(client.service)}</span>
                    </div>
                    <div class="client-actions">
                        <button class="action-btn edit-btn" onclick="editClient('${client.id}')" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteClient('${client.id}')" title="Excluir">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="client-details">
                    <div class="detail-item">
                        <i class="fa-brands fa-whatsapp"></i>
                        <span>${escapeHTML(client.phone)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fa-regular fa-calendar"></i>
                        <span>${date}</span>
                    </div>
                    <div class="detail-item" style="grid-column: 1 / -1;">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${escapeHTML(client.address)}</span>
                    </div>
                </div>
                
                ${client.notes ? `
                <div class="client-notes">
                    <strong>Obs:</strong> ${escapeHTML(client.notes)}
                </div>
                ` : ''}
            `;
            
            clientsList.appendChild(li);
        });
    }
}

// Utilities
function generateId() {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Simple Toast Notification
function showNotification(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    
    // Inline styling for simplicity instead of adding to CSS dynamically
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
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);
    
    // Animate out
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Boot
window.addEventListener('DOMContentLoaded', init);
