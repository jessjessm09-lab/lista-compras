// Configuración de Supabase
const SUPABASE_URL = 'https://cowrzmpglfknxhneustb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvd3J6bXBnbGZrbnhobmV1c3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjU2MDksImV4cCI6MjA4NTYwMTYwOX0.y1vu15OUlDuOBuSJP_Fq2Fq-X4TZaBfE_7ZBBdNbiHA';

let supabase = null;
let currentUser = null;
let lists = [];
let editingItem = null;
let listsSubscription = null;

// Inicializar Supabase
function initSupabase() {
    try {
        if (!window.supabase) {
            console.error('Supabase library not loaded');
            alert('Error: No se pudo cargar Supabase. Recarga la página.');
            return false;
        }
        
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        alert('Error al inicializar la base de datos. Recarga la página.');
        return false;
    }
}

// ========== AUTENTICACIÓN ==========

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing...');
    
    // Inicializar Supabase
    if (!initSupabase()) {
        return;
    }
    
    // Verificar sesión actual
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            currentUser = session.user;
            showMainScreen();
        } else {
            showLoginScreen();
        }
        
        setupAuthListeners();
    } catch (error) {
        console.error('Error checking session:', error);
        showLoginScreen();
        setupAuthListeners();
    }
});

function setupAuthListeners() {
    const authButton = document.getElementById('authButton');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const authEmail = document.getElementById('authEmail');
    const authPassword = document.getElementById('authPassword');
    
    console.log('Setting up auth listeners...');
    console.log('authButton:', authButton);
    console.log('toggleAuthMode:', toggleAuthMode);
    console.log('authEmail:', authEmail);
    console.log('authPassword:', authPassword);
    
    if (!authButton || !toggleAuthMode || !authEmail || !authPassword) {
        console.error('Some auth elements not found!');
        return;
    }
    
    let isLoginMode = true;
    
    authButton.addEventListener('click', async () => {
        const email = authEmail.value.trim();
        const password = authPassword.value;
        
        if (!email || !password) {
            showAuthError('Por favor completa todos los campos');
            return;
        }
        
        if (password.length < 6) {
            showAuthError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        authButton.disabled = true;
        authButton.textContent = isLoginMode ? 'Iniciando sesión...' : 'Registrando...';
        
        try {
            let result;
            
            if (isLoginMode) {
                result = await supabase.auth.signInWithPassword({ email, password });
            } else {
                result = await supabase.auth.signUp({ email, password });
            }
            
            if (result.error) throw result.error;
            
            if (!isLoginMode && result.data.user && !result.data.session) {
                showAuthError('Registro exitoso! Revisa tu email para confirmar tu cuenta.');
                authButton.disabled = false;
                authButton.textContent = 'Registrarse';
                return;
            }
            
            currentUser = result.data.user;
            showMainScreen();
            
        } catch (error) {
            console.error('Error de autenticación:', error);
            showAuthError(error.message || 'Error al autenticar');
            authButton.disabled = false;
            authButton.textContent = isLoginMode ? 'Iniciar Sesión' : 'Registrarse';
        }
    });
    
    toggleAuthMode.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        const title = document.getElementById('authTitle');
        
        if (isLoginMode) {
            title.textContent = 'Iniciar Sesión';
            authButton.textContent = 'Iniciar Sesión';
            toggleAuthMode.textContent = '¿No tienes cuenta? Regístrate';
        } else {
            title.textContent = 'Registrarse';
            authButton.textContent = 'Registrarse';
            toggleAuthMode.textContent = '¿Ya tienes cuenta? Inicia Sesión';
        }
        
        document.getElementById('authError').textContent = '';
    });
    
    // Enter para enviar
    authPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            authButton.click();
        }
    });
    
    // Logout
    document.getElementById('logoutButton').addEventListener('click', async () => {
        await supabase.auth.signOut();
        currentUser = null;
        
        if (listsSubscription) {
            listsSubscription.unsubscribe();
        }
        
        showLoginScreen();
    });
}

function showAuthError(message) {
    const errorDiv = document.getElementById('authError');
    errorDiv.textContent = message;
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('mainScreen').style.display = 'none';
}

function showMainScreen() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'block';
    document.getElementById('userEmail').textContent = currentUser.email;
    
    loadLists();
    subscribeToLists();
    
    // Setup new list input
    const newListInput = document.getElementById('newListName');
    newListInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createList();
        }
    });
}

// ========== MANEJO DE LISTAS ==========

async function loadLists() {
    try {
        const { data, error } = await supabase
            .from('lists')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        lists = data || [];
        await loadItemsForLists();
        renderLists();
        
    } catch (error) {
        console.error('Error cargando listas:', error);
    }
}

async function loadItemsForLists() {
    for (let list of lists) {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('list_id', list.id)
            .order('created_at', { ascending: true });
        
        if (!error) {
            list.items = data || [];
        }
    }
}

function subscribeToLists() {
    // Suscribirse a cambios en listas
    listsSubscription = supabase
        .channel('lists-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'lists', filter: `user_id=eq.${currentUser.id}` },
            (payload) => {
                console.log('Cambio en listas:', payload);
                loadLists();
            }
        )
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'items' },
            (payload) => {
                console.log('Cambio en items:', payload);
                loadLists();
            }
        )
        .subscribe();
}

async function createList() {
    const input = document.getElementById('newListName');
    const name = input.value.trim();
    const listType = document.querySelector('input[name="listType"]:checked').value;
    
    if (!name) return;
    
    try {
        const { data, error } = await supabase
            .from('lists')
            .insert([
                { 
                    name: name, 
                    user_id: currentUser.id,
                    type: listType
                }
            ])
            .select();
        
        if (error) throw error;
        
        input.value = '';
        await loadLists();
        
    } catch (error) {
        console.error('Error creando lista:', error);
        alert('Error al crear la lista');
    }
}

async function deleteList(listId) {
    if (!confirm('¿Estás seguro de eliminar esta lista?')) return;
    
    try {
        // Primero eliminar items
        await supabase
            .from('items')
            .delete()
            .eq('list_id', listId);
        
        // Luego eliminar lista
        const { error } = await supabase
            .from('lists')
            .delete()
            .eq('id', listId);
        
        if (error) throw error;
        
        await loadLists();
        
    } catch (error) {
        console.error('Error eliminando lista:', error);
        alert('Error al eliminar la lista');
    }
}

async function addItem(listId) {
    const input = document.getElementById(`input-${listId}`);
    const name = input.value.trim();
    
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    
    let price = null;
    
    if (list.type === 'price') {
        const priceInput = document.getElementById(`price-${listId}`);
        const priceValue = priceInput.value.trim();
        
        if (!name) return;
        
        if (priceValue) {
            price = parseFloat(priceValue);
            if (isNaN(price) || price < 0) {
                alert('Por favor ingresa un precio válido');
                return;
            }
        }
    } else {
        if (!name) return;
    }
    
    try {
        const { error } = await supabase
            .from('items')
            .insert([
                { 
                    name: name,
                    list_id: listId,
                    completed: false,
                    price: price
                }
            ]);
        
        if (error) throw error;
        
        input.value = '';
        if (list.type === 'price') {
            document.getElementById(`price-${listId}`).value = '';
        }
        
        await loadLists();
        
    } catch (error) {
        console.error('Error agregando item:', error);
        alert('Error al agregar el item');
    }
}

async function toggleItem(listId, itemId) {
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    
    const item = list.items.find(i => i.id === itemId);
    if (!item) return;
    
    try {
        const { error } = await supabase
            .from('items')
            .update({ completed: !item.completed })
            .eq('id', itemId);
        
        if (error) throw error;
        
        await loadLists();
        
    } catch (error) {
        console.error('Error actualizando item:', error);
    }
}

async function deleteItem(listId, itemId) {
    try {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', itemId);
        
        if (error) throw error;
        
        await loadLists();
        
    } catch (error) {
        console.error('Error eliminando item:', error);
        alert('Error al eliminar el item');
    }
}

function startEdit(listId, itemId) {
    editingItem = { listId, itemId };
    renderLists();
}

async function saveEdit(listId, itemId) {
    const input = document.getElementById(`edit-${listId}-${itemId}`);
    const newName = input.value.trim();
    
    if (!newName) return;
    
    const list = lists.find(l => l.id === listId);
    let price = null;
    
    if (list && list.type === 'price') {
        const priceInput = document.getElementById(`edit-price-${listId}-${itemId}`);
        const priceValue = priceInput.value.trim();
        
        if (priceValue) {
            price = parseFloat(priceValue);
            if (isNaN(price) || price < 0) {
                alert('Por favor ingresa un precio válido');
                return;
            }
        }
    }
    
    try {
        const updateData = { name: newName };
        if (list && list.type === 'price') {
            updateData.price = price;
        }
        
        const { error } = await supabase
            .from('items')
            .update(updateData)
            .eq('id', itemId);
        
        if (error) throw error;
        
        editingItem = null;
        await loadLists();
        
    } catch (error) {
        console.error('Error editando item:', error);
        alert('Error al editar el item');
    }
}

function cancelEdit() {
    editingItem = null;
    renderLists();
}

// ========== RENDERIZADO ==========

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
        
        let totalPrice = 0;
        if (list.type === 'price') {
            totalPrice = list.items.reduce((sum, item) => {
                return sum + (item.price || 0);
            }, 0);
        }
        
        return `
            <div class="card">
                <div class="list-header">
                    <div>
                        <h3>${escapeHtml(list.name)} ${list.type === 'price' ? '💰' : ''}</h3>
                        <small>${completed} de ${total} completados</small>
                        ${list.type === 'price' ? `<small style="display: block; margin-top: 3px;">Total: $${totalPrice.toFixed(0)}</small>` : ''}
                    </div>
                    <button class="btn-delete" onclick="deleteList('${list.id}')">🗑️</button>
                </div>
                
                <div class="input-group" style="gap: 5px;">
                    <input 
                        type="text" 
                        id="input-${list.id}" 
                        placeholder="${list.type === 'price' ? 'Nombre del producto' : 'Agregar item a la lista...'}"
                        onkeypress="if(event.key==='Enter') ${list.type === 'price' ? 'document.getElementById(\'price-' + list.id + '\').focus()' : 'addItem(\'' + list.id + '\')'}"
                        style="flex: ${list.type === 'price' ? '2' : '1'};"
                    >
                    ${list.type === 'price' ? `
                        <input 
                            type="number" 
                            id="price-${list.id}" 
                            placeholder="Precio"
                            onkeypress="if(event.key==='Enter') addItem('${list.id}')"
                            style="flex: 1; min-width: 80px;"
                        >
                    ` : ''}
                    <button class="btn-success" onclick="addItem('${list.id}')">+</button>
                </div>
                
                <div>
                    ${list.items.length === 0 ? 
                        '<div class="empty-state"><div class="empty-state-icon">📝</div><p>No hay items en esta lista</p></div>' :
                        list.items.map(item => renderItem(list.id, item, list.type)).join('')
                    }
                </div>
            </div>
        `;
    }).join('');
}

function renderItem(listId, item, listType) {
    const isEditing = editingItem && editingItem.listId === listId && editingItem.itemId === item.id;
    
    if (isEditing) {
        return `
            <div class="item">
                <input 
                    type="text" 
                    id="edit-${listId}-${item.id}" 
                    value="${escapeHtml(item.name)}"
                    onkeypress="if(event.key==='Enter') ${listType === 'price' ? 'document.getElementById(\'edit-price-' + listId + '-' + item.id + '\').focus()' : 'saveEdit(\'' + listId + '\', \'' + item.id + '\')'}"
                    style="flex: ${listType === 'price' ? '2' : '1'};"
                    autofocus
                >
                ${listType === 'price' ? `
                    <input 
                        type="number" 
                        id="edit-price-${listId}-${item.id}" 
                        value="${item.price || ''}"
                        placeholder="Precio"
                        onkeypress="if(event.key==='Enter') saveEdit('${listId}', '${item.id}')"
                        style="flex: 1; min-width: 80px;"
                    >
                ` : ''}
                <button class="btn-icon btn-save" onclick="saveEdit('${listId}', '${item.id}')">✓</button>
                <button class="btn-icon btn-cancel" onclick="cancelEdit()">✕</button>
            </div>
        `;
    }
    
    const priceDisplay = listType === 'price' && item.price ? `<span class="item-price">$${item.price.toFixed(0)}</span>` : '';
    
    return `
        <div class="item">
            <input 
                type="checkbox" 
                ${item.completed ? 'checked' : ''} 
                onchange="toggleItem('${listId}', '${item.id}')"
            >
            <span class="item-text ${item.completed ? 'completed' : ''}">${escapeHtml(item.name)}</span>
            ${priceDisplay}
            <button class="btn-icon btn-edit" onclick="startEdit('${listId}', '${item.id}')">✏️</button>
            <button class="btn-icon btn-icon-delete" onclick="deleteItem('${listId}', '${item.id}')">🗑️</button>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
