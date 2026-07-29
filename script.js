const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const clearButton = document.getElementById('clear-button');
const resetButton = document.getElementById('reset-button');

const STORAGE_KEY = 'simpleWebProjectTodos';

function loadTodos() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos() {
    const todos = loadTodos();
    todoList.innerHTML = '';

    if (todos.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No tasks yet. Add one to get started!';
        emptyMessage.style.color = '#5f6b84';
        todoList.appendChild(emptyMessage);
        return;
    }

    todos.forEach((todo, index) => {
        const item = document.createElement('li');
        if (todo.done) item.classList.add('completed');

        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = todo.text;

        const actions = document.createElement('div');
        actions.className = 'todo-actions';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = todo.done ? 'Undo' : 'Done';
        toggleButton.addEventListener('click', () => {
            todos[index].done = !todos[index].done;
            saveTodos(todos);
            renderTodos();
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos(todos);
            renderTodos();
        });

        actions.append(toggleButton, removeButton);
        item.append(text, actions);
        todoList.appendChild(item);
    });
}

function addTodo(text) {
    const todos = loadTodos();
    todos.push({ text, done: false });
    saveTodos(todos);
    renderTodos();
}

todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = todoInput.value.trim();
    if (value === '') return;
    addTodo(value);
    todoInput.value = '';
    todoInput.focus();
});

clearButton.addEventListener('click', () => {
    const todos = loadTodos().map(todo => ({ ...todo, done: false }));
    saveTodos(todos);
    renderTodos();
});

resetButton.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    renderTodos();
});

renderTodos();
