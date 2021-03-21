const addNewTaskForm = document.querySelector('#addNewTaskForm');
const addNewTaskInput = document.querySelector('#addNewTaskInput');
const tasksContainer = document.querySelector('#tasksContainer');
const deleteTask = document.querySelector('#deleteTask')

const listDisplayContainer = document.querySelector('#listDisplayContainer')
const lists = document.querySelector('#lists')

const LOCAL_STORAGE_TASK_KEY = 'task.key'
const LOCAL_STORAGE_SELECTED_TASK_KEY = 'selectedTask.key'
let currentData = localStorage.getItem(LOCAL_STORAGE_TASK_KEY);
let selectedTaskId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TASK_KEY);
let tasks = JSON.parse(currentData) || [];

render();
//EVENT LISTENER
addNewTaskForm.addEventListener('submit',  e => {
    e.preventDefault();
    const newTask = addNewTaskInput.value;
    if(newTask === null || newTask === '') return;

    const addTask = addNewTask(newTask);
    tasks.push(addTask);
    saveAndRender();
    addNewTaskInput.value = "";
})
tasksContainer.addEventListener('click', e => {
    const task = e.target;
    if(task.tagName.toLowerCase() === 'li'){
        selectedTaskId = task.getAttribute('id');
        saveAndRender()
    }
})
deleteTask.addEventListener('click', e => {
    tasks = tasks.filter(task => task.id !== selectedTaskId);
    selectedTaskId = null;
    saveAndRender();
})
//FUNCTION
function saveAndRender(){
    saveToLocalStorage();
    render();
}
//render
function render(){
    clearElement(tasksContainer);
    renderTask();
    const selectedTask = tasks.find(task => task.id === selectedTaskId);
    if(selectedTask == null){
        listDisplayContainer.style.display = 'none'
        deleteTask.style.display = 'none'
    }else{
        listDisplayContainer.style.display = ''
        deleteTask.style.display = ''
    }
}
//render task
function renderTask(){
    tasks.forEach(task => {
         //create list element
        const li = document.createElement('li')
        li.classList.add('task');
        li.setAttribute('id', task.id)
        li.innerText = task.task;
        if(task.id == selectedTaskId){
            li.classList.add('active-task');
        }
        //appent list to task container
        tasksContainer.appendChild(li)
    })
}
function addNewTask(task){
    return {id: Date.now().toString(), task: task, lists: []};
}
//Clear Existing Element
function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

//Save to Local Storage
function saveToLocalStorage(){
    localStorage.setItem(LOCAL_STORAGE_TASK_KEY, JSON.stringify(tasks));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_TASK_KEY, selectedTaskId);
}