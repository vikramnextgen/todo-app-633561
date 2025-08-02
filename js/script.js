// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const tasksCounter = document.getElementById('tasks-counter');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');

// State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Save todos to localStorage
const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

// Update tasks counter
const updateTasksCounter = () => {
    const activeTasks = todos.filter(todo => !todo.completed).length;
    tasksCounter.textContent = `${activeTasks} item${activeTasks !== 1 ? 's' : ''} left`;
};

// Create todo element
const createTodoElement = (todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${todo.text}</span>
        <div class="todo-actions">
            <button class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Add event listeners
    const checkbox = li.querySelector('.todo-checkbox');
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    return li;
};

// Render todos based on current filter
const renderTodos = () => {
    todoList.innerHTML = '';
    
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    filteredTodos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });

    updateTasksCounter();
};

// Add new todo
const addTodo = (text) => {
    if (text.trim()) {
        const newTodo = {
            id: Date.now().toString(),
            text: text.trim(),
            completed: false
        };
        
        todos.unshift(newTodo);
        saveTodos();
        renderTodos();
    }
};

// Toggle todo completion
const toggleTodo = (id) => {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
};

// Delete todo
const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
};

// Clear completed todos
const clearCompleted = () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
};

// Event Listeners
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(todoInput.value);
    todoInput.value = '';
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        renderTodos();
    });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// Initial render
renderTodos();