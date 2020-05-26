const taskTitle = document.getElementsByClassName('taskTitle')[0];
const taskDescription = document.getElementsByClassName('taskDescription')[0];
const addBtn = document.getElementsByClassName('addBtn')[0];
const list = document.getElementsByClassName('taskList')[0];

let taskList;
if (localStorage.getItem('items')) {
  taskList = JSON.parse(localStorage.getItem('items'));
} else {
  taskList = [];
}
localStorage.setItem('items', JSON.stringify(taskList));
const data = JSON.parse(localStorage.getItem('items'));

function Task(title, description, id) {
  this.Title = title;
  this.Description = description;
  this.Id = id;
  this.info = () => ({ Title: title, Description: description, Id: id });
}

function setTaskBody(element, obj) {
  const currentElement = element;
  currentElement.innerHTML = `<h2>${obj.Title}</h2><p>${obj.Description}</p>`;
  taskTitle.value = '';
  taskDescription.value = '';
}

function findTaskInTaskList(taskClassName, taskListArray) {
  let result = '';
  const number = /([0-9]+)/;
  const divId = number.exec(taskClassName)[0];
  for (let i = 0; i < taskListArray.length; i += 1) {
    if (taskListArray[i].Id.toString() === divId) {
      result = taskListArray.indexOf(taskListArray[i]);
    }
  }
  return result;
}

function removeTask(element) {
  const parrent = element.parentNode;
  const grandParrent = parrent.parentNode;
  const taskListIndex = findTaskInTaskList(parrent.className, taskList);
  taskList.splice(taskListIndex, 1);
  grandParrent.removeChild(parrent);
  localStorage.setItem('items', JSON.stringify(taskList));
}

function appendRemoveBtn(element) {
  const removeBtn = document.createElement('button');
  removeBtn.className = 'removeBtn';
  removeBtn.innerHTML = 'X';
  removeBtn.addEventListener('click', () => {
    removeTask(removeBtn);
  });
  const firstDivChild = element.firstChild;
  element.insertBefore(removeBtn, firstDivChild);
}

function setTaskEvent(element) {
  element.addEventListener('click', () => {
    element.classList.add('done');
    if (element.childNodes.length === 2) {
      appendRemoveBtn(element);
    }
  });
}

function setTask(taskObj) {
  const taskDiv = document.createElement('div');
  taskDiv.className = `taskBody${taskObj.Id}`;
  setTaskBody(taskDiv, taskObj);
  setTaskEvent(taskDiv);
  list.appendChild(taskDiv);
}

data.forEach((task) => {
  setTask(task);
});

function currentId(taskListArray) {
  let startTaskId = 0;
  for (let i = 0; i < taskListArray.length; i += 1) {
    if (startTaskId < taskListArray[i].Id) {
      startTaskId = taskListArray[i].Id;
    }
  }
  return startTaskId;
}

addBtn.addEventListener('click', () => {
  if (taskTitle.value === '' || taskDescription.value === '') {
    alert('Please enter a Title and Description for your task.');
  } else {
    const newTask = new Task(taskTitle.value, taskDescription.value, (currentId(taskList) + 1));
    taskList.push(newTask);
    localStorage.setItem('items', JSON.stringify(taskList));
    currentId(taskList);
    setTask(newTask);
  }
});
