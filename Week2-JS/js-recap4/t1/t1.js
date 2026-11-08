// array for todo list
const todoList = [
  {
    id: 1,
    task: 'Learn HTML',
    completed: true,
  },
  {
    id: 2,
    task: 'Learn CSS',
    completed: true,
  },
  {
    id: 3,
    task: 'Learn JS',
    completed: false,
  },
  {
    id: 4,
    task: 'Learn TypeScript',
    completed: false,
  },
  {
    id: 5,
    task: 'Learn React',
    completed: false,
  },
];

const list = document.querySelector('ul');
const dialog = document.querySelector('dialog');
const form = dialog.querySelector('form');
const input = form.querySelector('input');
const addButton = document.querySelector('.add-btn');

function createTodoItem(item) {
  const listItem = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `todo-${item.id}`;
  checkbox.checked = item.completed;

  const label = document.createElement('label');
  label.htmlFor = `todo-${item.id}`;
  label.textContent = item.task;

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.setAttribute('aria-label', `Delete ${item.task}`);

  checkbox.addEventListener('change', () => {
    item.completed = checkbox.checked;
    console.log(todoList);
  });

  deleteButton.addEventListener('click', () => {
    const index = todoList.indexOf(item);
    todoList.splice(index, 1);
    list.removeChild(listItem);
    console.log(todoList);
  });

  listItem.append(checkbox, label, deleteButton);
  return listItem;
}

todoList.forEach((item) => {
  list.appendChild(createTodoItem(item));
});

addButton.addEventListener('click', () => {
  dialog.showModal();
  input.focus();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const task = input.value.trim();

  if (task === '') {
    return;
  }

  const nextId = Math.max(...todoList.map((item) => item.id), 0) + 1;
  const newItem = {
    id: nextId,
    task,
    completed: false,
  };

  todoList.push(newItem);
  list.appendChild(createTodoItem(newItem));
  console.log(todoList);

  form.reset();
  dialog.close();
});
