let lists = [];
let editingItem = null;

// Cargar datos al iniciar
function loadData() {
    const saved = localStorage.getItem('shoppingLists');
    if (saved) {
        lists = JSON.parse(saved);
        renderLists();
    }
}

// Guardar datos
function saveData() {
    localStorage.setItem('shoppingLists', JSON.stringify(lists));
}

// Crear nueva lista
function createList() {
    const input = document.getElementById('newListName');
    const name = input.value.trim();
    
    if (name) {
        lists.push({
            id: Date.now(),
            name: name,
            items: []
        });
        input.value = '';
        saveData();
        renderLists();
    }
}

// Eliminar lista
function deleteList(listId) {
    if (confirm('¿Estás seguro de eliminar esta lista?')) {
        lists = lists.filter(list => list.id !== listId);
        saveData();
        renderLists();
    }
}

// Agregar item
function addItem(listId) {
    const input = document.getElementById(`input-${listId}`);
    const name = input.value.trim();
    
    if (name) {
        const list = lists.find(l => l.id === listId);
        if (list) {
            list.items.push({
                id: Date.now(),
                name: name,
                completed: false
            });
            input.value = '';
            saveData();
            renderLists();
        }
    }
}

// Marcar item como completado
function toggleItem(listId, itemId) {
    const list = lists.find(l => l.id === listId);
    if (list) {
        const item = list.items.find(i => i.id === itemId);
        if (item) {
            item.completed = !item.completed;
            saveData();
            renderLists();
        }
    }
}

// Iniciar edición
function startEdit(listId, itemId) {
    editingItem = { listId, itemId };
    renderLists();
}

// Guardar edición
function saveEdit(listId, itemId) {
    const input = document.getElementById(`edit-${listId}-${itemId}`);
    const newName = input.value.trim();
    
    if (newName) {
        const list = lists.find(l => l.id === listId);
        if (list) {
            const item = list.items.find(i => i.id === itemId);
            if (item) {
                item.name = newName;
                editingItem = null;
                saveData();
                renderLists();
            }
        }
    }
}

// Cancelar edición
function cancelEdit() {
    editingItem = null;
    renderLists();
}

// Eliminar item
function deleteItem(listId, itemId) {
    const list = lists.find(l => l.id === listId);
    if (list) {
        list.items = list.items.filter(i => i.id !== itemId);
        saveData();
        renderLists();
    }
}

// Renderizar todas las listas
function renderLists() {
    const container = document.getElementById('listsContainer');
    const noLists = document.getElementById('noLists');
    
    if (lists.length === 0) {
        container.classList.remove('show');
        noLists.style.display = 'block';
        return;
    }
    
    noLists.style.display = 'none';
    container.classList.add('show');
    
    container.innerHTML = lists.map(list => {
        const completed = list.items.filter(i => i.completed).length;
        const total = list.items.length;
        
        return `
            <div class="card">
                <div class="list-header">
                    <div>
                        <h3>${escapeHtml(list.name)}</h3>
                        <small>${completed} de ${total} completados</small>
                    </div>
                    <button class="btn-delete" onclick="deleteList(${list.id})">🗑️ Eliminar</button>
                </div>
                
                <div class="input-group">
                    <input 
                        type="text" 
                        id="input-${list.id}" 
                        placeholder="Agregar item a la lista..."
                        onkeypress="if(event.key==='Enter') addItem(${list.id})"
                    >
                    <button class="btn-success" onclick="addItem(${list.id})">+</button>
                </div>
                
                <div>
                    ${list.items.length === 0 ? 
                        '<div class="empty-state"><div class="empty-state-icon">📝</div><p>No hay items en esta lista</p></div>' :
                        list.items.map(item => renderItem(list.id, item)).join('')
                    }
                </div>
            </div>
        `;
    }).join('');
}

// Renderizar un item
function renderItem(listId, item) {
    const isEditing = editingItem && editingItem.listId === listId && editingItem.itemId === item.id;
    
    if (isEditing) {
        return `
            <div class="item">
                <input 
                    type="text" 
                    id="edit-${listId}-${item.id}" 
                    value="${escapeHtml(item.name)}"
                    onkeypress="if(event.key==='Enter') saveEdit(${listId}, ${item.id})"
                    autofocus
                >
                <button class="btn-icon btn-save" onclick="saveEdit(${listId}, ${item.id})">✓</button>
                <button class="btn-icon btn-cancel" onclick="cancelEdit()">✕</button>
            </div>
        `;
    }
    
    return `
        <div class="item">
            <input 
                type="checkbox" 
                ${item.completed ? 'checked' : ''} 
                onchange="toggleItem(${listId}, ${item.id})"
            >
            <span class="item-text ${item.completed ? 'completed' : ''}">${escapeHtml(item.name)}</span>
            <button class="btn-icon btn-edit" onclick="startEdit(${listId}, ${item.id})">✏️</button>
            <button class="btn-icon btn-icon-delete" onclick="deleteItem(${listId}, ${item.id})">🗑️</button>
        </div>
    `;
}

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // Permitir crear lista con Enter
    const newListInput = document.getElementById('newListName');
    if (newListInput) {
        newListInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                createList();
            }
        });
    }
});
