//DOM
//task
const tasksContainer = document.querySelector('#tasksContainer');
const addNewTaskForm = document.querySelector('#addNewTaskForm');
const addNewTaskInput = document.querySelector('#addNewTaskInput');
const deleteTask = document.querySelector('#deleteTask');

//todo
const listDisplayContainer = document.querySelector('#listDisplayContainer');
const listTodos = document.querySelector('#listTodos');
const addNewTodoForm = document.querySelector('#addNewTodoForm');
const addNewTodoInput = document.querySelector('#addNewTodoInput');
const todosCount = document.querySelector('#todosCount');
const todoTitle = document.querySelector('#todoTitle');
const deleteTodo = document.querySelector('#deleteTodo')
//VARIABLES *******************************************************
//Key for local storage
const TASK_KEY = 'task.key';
const SELECTED_TASK_KEY = 'selectedTask.key'
//data
const currentData = localStorage.getItem(TASK_KEY);
let selectedTaskId = localStorage.getItem(SELECTED_TASK_KEY);
//array task list
let taskLists = JSON.parse(currentData) || [];

//EVENT LISTENER ****************************************************
//event listener for todo container
listTodos.addEventListener('click', e => {
    const list = e.target;
    if(list.tagName.toLowerCase() == 'input'){
        const selectedTask = taskLists.find(task => task.id === selectedTaskId);
        const selectedTodo = selectedTask.todos.find(todo => todo.id === list.getAttribute('id'))
        selectedTodo.complete = list.checked
        save();
        renderTodoCount(selectedTask)
    }
});
//event listener for form of adding new todo
addNewTodoForm.addEventListener('submit', e => {
    e.preventDefault();
    const newTodoValue = addNewTodoInput.value;
    if(newTodoValue === null || newTodoValue === '') return;
    const newTodo = createNewTodo(newTodoValue);
    const task = taskLists.find(task => task.id === selectedTaskId)
    task.todos.push(newTodo);
    saveAndRender();
    addNewTodoInput.value = '';
});
//event listener for form of adding new task
addNewTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const newTaskValue = addNewTaskInput.value;
    if(newTaskValue === null || newTaskValue === '') return;
    const newTask = createNewTask(newTaskValue);
    
    taskLists.push(newTask);
    saveAndRender()
    addNewTaskInput.value = '';
});
//event listener for task container
tasksContainer.addEventListener('click', e => {
    const list = e.target;
    if(list.tagName.toLowerCase() == 'li'){
        selectedTaskId = list.getAttribute('id');
        saveAndRender();
    }
});
//events listener for deleting Task 
deleteTask.addEventListener('click', e => {
    taskLists = taskLists.filter(task => task.id !== selectedTaskId);
    selectedTaskId = null;
    saveAndRender();
});
//events listener for deleteTodo 
deleteTodo.addEventListener('click', e => {
    const tasks = taskLists.find(task => task.id === selectedTaskId);
    tasks.todos = tasks.todos.filter(todo => todo.complete === false)
    saveAndRender();
});

//FUNCTION *********************************************************
//create todo info
function createNewTodo(todo){
    return { id: Date.now().toString(), todo: todo, complete: false};
}
//create task info
function createNewTask(task){
    return { id: Date.now().toString(), task: task, todos: []};
}
//Save to local Storage
function save(){
    localStorage.setItem(TASK_KEY, JSON.stringify(taskLists));
    localStorage.setItem(SELECTED_TASK_KEY, selectedTaskId);
}

//clear existing element
function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

function saveAndRender(){
    save();
    render();
}
function render(){
    clearElement(tasksContainer);
    renderTask()
    const selectedTask = taskLists.find(task => task.id === selectedTaskId);
    if(selectedTask == null){
        listDisplayContainer.style.display = 'none';
        deleteTask.style.display = 'none';
    }else{
        listDisplayContainer.style.display = '';
        deleteTask.style.display = '';
        todoTitle.innerText = selectedTask.task;
        clearElement(listTodos);
        renderTodo(selectedTask)
        renderTodoCount(selectedTask)
    }
}
function renderTodoCount(selectedTask){
    const count = selectedTask.todos.filter(todo => todo.complete === false).length;
    const strTask = count > 1 ? 'tasks' : 'task'
    const str = `${count} ${strTask} remaining`
    todosCount.innerText = str;
}
function renderTodo(selectedTask){
    selectedTask.todos.forEach(todo => {
        //create li element
        const li = document.createElement('li');
        
        //create checkbox
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', todo.id);
        checkbox.checked = todo.complete;
        li.appendChild(checkbox)

        //create label
        const label = document.createElement('label');
        label.setAttribute('for', todo.id);
        label.innerText = todo.todo;
        li.appendChild(label)
        
        listTodos.appendChild(li);
    });
}
function renderTask(){
    taskLists.forEach(task => {
         //create li element
        const li = document.createElement('li');
        li.setAttribute('id', task.id);
        li.classList.add('task');
        li.innerText = task.task;
        if(task.id == selectedTaskId){
            li.classList.add('active-task');
        }
        tasksContainer.appendChild(li);
    });
    
}

//FUNCTION CALL ************************************************
render()