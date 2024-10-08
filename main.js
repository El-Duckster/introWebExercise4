import './style.scss'

// Task array
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// DOM Elements
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const errorMessage = document.querySelector('#error-message');
const totalTasks = document.querySelector('#total-tasks');
const notCompletedTasks = document.querySelector('#not-completed-tasks');
const completedCounter = document.querySelector('#completed-counter');
const todoForm = document.querySelector('#todo-form');

// Save tasks to localStorage
const saveTodosToLocalStorage = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
};
// Add Task
const addTask = () => {
  const taskText = todoInput.value.trim();

  // Check if input is empty
  if (!taskText) {
    errorMessage.textContent = 'You must write something!';
    errorMessage.style.visibility = 'visible';
    return;
  } else {
    errorMessage.textContent = '';
    errorMessage.style.visibility = 'hidden';
  }

  // Create task object
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  // Add task to the array
  todos = [...todos, newTask]; 
  todoInput.value = ''; 
  saveTodosToLocalStorage();
  renderTodos();

  const newListItem = document.querySelector(`li[data-id="${newTask.id}"]`);
  newListItem.classList.add('adding');
  setTimeout(() => {
    newListItem.classList.remove('adding');
  }, 400); 
};




// Render the todo list
const renderTodos = () => {
  // Clear the todoList first
  todoList.innerHTML = '';

  if (todos.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.classList.add('empty-message');
    emptyMessage.textContent = 'The list is empty, start by adding new tasks.';
    todoList.appendChild(emptyMessage);
  } else {
    todos.forEach(({ id, text, completed }) => {
      // Create <li> element
      const listItem = document.createElement('li');
      listItem.dataset.id = id;

      if (completed) {
        listItem.classList.add('completed');
      }

      // Create <span> for task text
      const taskText = document.createElement('span');
      taskText.textContent = text;

      // Create <button> for delete action
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-btn');
      deleteButton.setAttribute('aria-label', 'Delete task');
      deleteButton.textContent = '❌';

      // Append text and button to list item
      listItem.appendChild(taskText);
      listItem.appendChild(deleteButton);

      // Append the list item to the todoList
      todoList.appendChild(listItem);
    });
  }
  
  updateTaskCounters();
};


// Toggle task completion
const toggleTaskCompletion = (taskId) => {
  todos = todos.map(task =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveTodosToLocalStorage();
  renderTodos();
};

// Delete task

const deleteTask = (taskId) => {

  const listItem = document.querySelector(`li[data-id="${taskId}"]`);
  listItem.classList.add('removing');

setTimeout(() => {
  todos = todos.filter(task => task.id !== taskId);
  saveTodosToLocalStorage();
  renderTodos();
}, 400); 
};
// Update completed tasks counter
const updateTaskCounters = () => {
  const total = todos.length;
  const completed = todos.filter(task => task.completed).length;
  const notCompleted = total - completed;

  // Update the text content for each counter
  totalTasks.textContent = `Total tasks: ${total}`;
  notCompletedTasks.textContent = `Pending tasks: ${notCompleted}`;
  completedCounter.textContent = `Completed tasks: ${completed}`;
};

// Event Listener for Add Button
todoForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form from refreshing the page
  addTask(); 
});

// Event Delegation for task actions (toggle or delete)
todoList.addEventListener('click', (e) => {
  const listItem = e.target.closest('li'); 
  if (!listItem) return;

  const taskId = Number(listItem?.dataset?.id);

  if (e.target.classList.contains('delete-btn')) {
    deleteTask(taskId);
  } else {
    toggleTaskCompletion(taskId);
  }
});

renderTodos();
