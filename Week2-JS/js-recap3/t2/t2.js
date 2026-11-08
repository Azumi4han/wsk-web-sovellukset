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

todoList.forEach((item) => {
  const listItem = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `todo-${item.id}`;
  checkbox.checked = item.completed;

  const label = document.createElement('label');
  label.htmlFor = `todo-${item.id}`;
  label.textContent = item.task;

  listItem.append(checkbox, label);
  list.append(listItem);
});
