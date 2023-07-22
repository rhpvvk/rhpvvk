let todoList = [];
const baseTodoId = 'todoitem';
let priorityFilters = {
    low: false,
    medium: false,
    high: false,
}

const filterDictionary = {
    low: '1-2 сезона',
    medium: '3-4 сезона',
    high: '5 и более сезонов'
}

const storageData = localStorage.getItem('toDoList');
document.addEventListener("DOMContentLoaded", (event)=>{
    if (storageData !== null) {
        todoList = JSON.parse(storageData);
        reRenderList();
    }
});

function deleteElement(id) {
    const index = todoList.findIndex(item => item.id === id);
    todoList.splice(index, 1);
    document.getElementById(baseTodoId + id).remove();
    reWriteStorage();
}

function addToDo() {
    const form = document.forms.toDoForm;
    const newTodo = {
        id: createNewId(),
        title: form.elements.title.value,
    
        description: form.elements.description.value,
        date: new Date(form.elements.date.value).getTime(),
        done: false,
        deleteSelected: false,
        priority: form.elements.priority.value
    }
    todoList.push(newTodo);
    reRenderList();
}

function createNewId() {
    return todoList.length === 0 ?
        1 : Math.max(
            ...todoList.map(todo => todo.id)
        ) + 1;
}

function addToDoToHtml(newToDo) {
    const div = document.createElement('div');
    div.id = baseTodoId + newToDo.id;
    div.className = 'row my-3';

    div.innerHTML = `<div class="col">
                        <div class="card">
                           
                            <div class="card-body">

                                <h5 class="card-title"> ${newToDo.title} </h5>

                                <p class="card-text"> ${newToDo.description} </p>

                                

                                <p class="card-text"><small class="text-muted">${new Date(newToDo.date).toLocaleDateString('ru-RU')}</small></p>

                                <p class="card-text">Кол-во сезонов:  <small class="text-muted">${filterDictionary[newToDo.priority]}</small></p>
                                <input onclick="doneStateChanged(${newToDo.id}, this)" ${newToDo.done ? 'checked' : ''} type="checkbox" class="doneCheckBox" name="done">

                                
                                <label for="doneCheckBox"">Просмотрено</label><br/>
                                <input onclick="deleteStateChanged(${newToDo.id}, this)" ${newToDo.deleteSelected ? 'checked' : ''} type="checkbox" class="deleteCheckBox" name="deleteSelected">

                                <label for="deleteSelected"">Выделить</label><br/>

                                
                                <div class="col d-flex" style="margin-top:30px;">
                                    <button type="button" class="btn btn-danger" onclick="deleteElement(${newToDo.id})"> <img src="trash.png" width="27" height="29" align="center"> </button>
                                    <button type="button" class="btn btn-outline-primary btn-lg" style="margin:0 5px;" onclick="moveItem('top',${newToDo.id})"> 🠕 </button>
                                    <button type="button" class="btn btn-outline-primary btn-lg" style="margin:0 5px" onclick="moveItem('bottom',${newToDo.id})"> ↓ </button>
                                </div>

                            </div>
                        </div>
                     </div>`
    // добавляем наш элемент в контейнер из шаблона
    document.getElementById('toDoListWrapper').append(div);
}


function doneStateChanged(id, checkbox){
    todoList.find(item => item.id === id).done = checkbox.checked;
    reWriteStorage();
}


function deleteStateChanged(id, checkbox){
    todoList.find(item => item.id === id).deleteSelected = checkbox.checked;
    reWriteStorage();
}


function deleteSelected() {
    const deleteAllFromToDoList = ()=>{
        let idx = todoList.findIndex(item=>item.deleteSelected === true);
        if (idx !== -1) {
            todoList.splice(idx, 1);
            deleteAllFromToDoList();
        }
    }
    deleteAllFromToDoList();
    reRenderList();
}


function reRenderList(){
    document.getElementById('toDoListWrapper').innerHTML = '';
    let priorityAllowed = [];
    Object.keys(priorityFilters).forEach((key)=>{
        if(priorityFilters[key]){
            priorityAllowed.push(key);
        }
    })
    todoList.forEach((item)=>{
        if (priorityAllowed.length !== 0) {
            if(priorityAllowed.includes(item.priority)){
                addToDoToHtml(item);
            }
        } else {
            addToDoToHtml(item);
        }
    });
    reWriteStorage();
}


function reWriteStorage(){
    localStorage.clear();
    localStorage.setItem('toDoList', JSON.stringify(todoList));
}


function sortList(type) {
    if (type === 'ASC') {
        todoList.sort((a, b) => a.date - b.date);
    } else if (type === 'DESC') {
        todoList.sort((a, b) => b.date - a.date);
    }
    reRenderList();
}


function priorityFilterChange(){
    const priorityForm = document.forms.priorityFilterForm;
    priorityFilters = {
        low: priorityForm.elements.low.checked,
        medium: priorityForm.elements.medium.checked,
        high: priorityForm.elements.high.checked,
    }
    this.reRenderList();
}


function moveItem(direction, id){
    const idx = todoList.findIndex(item=>item.id === id);
    const item = todoList.find(x => x.id === id);
    todoList.splice(idx, 1);
    if(direction === 'top'){
        todoList.splice(idx - 1, 0, item);
    } else if(direction === 'bottom'){
        todoList.splice(idx + 1, 0, item);
    }
    reRenderList();
}
