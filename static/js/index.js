// const getUrl = urlHolder.getAttribute('data-getUrl');

// ajax request to all tasks
ajaxGetRequest('all_todos/');


// function to create li that is appended to ul
const todoList = {
    createElement: function(tasks){
    // 'No tasks to show' is displayed when there is no task
    let tasksList = document.querySelector('#tasksList');
    tasksList.innerHTML = '';
    if(tasks.length === 0){
        let tasksList = document.querySelector('#tasksList');
        tasksList.innerHTML = 'No tasks to show';
    }

    // tasks sorted in reverse so that last added or updated appears at top
    tasks.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
    tasks.reverse();
    for(let task of tasks){

    // li tag
    let li = todoList.createLi(task);

    // div with class of d-flex to hold checkbox, title, edit button and delete button
    let flexDiv = todoList.createSingleElement('div', 'd-flex flex-row align-items-baseline', '');

    // checkbox
    flexDiv.appendChild(todoList.createCheckbox(task));

    // task title div
    flexDiv.appendChild(todoList.createSingleElement('p', 'px-2 mr-auto h5', task.title));

    // edit button
    flexDiv.appendChild(todoList.createEditOrDeleteBtn('fas fa-edit pr-4', 'todoList.editBtnOnClick(this)'));

    // delete button
    flexDiv.appendChild(todoList.createEditOrDeleteBtn('fas fa-times', 'todoList.deleteTask(this)'));

    // task description div
    let descriptionDiv = todoList.createSingleElement('div', 'text-justify', task.description);

    // div to which task date and time divs are appended
    let div = document.createElement('div');
    div.appendChild(todoList.dateOrTimeDiv(task.task_time, 'float-right ml-3'));
    div.appendChild(todoList.dateOrTimeDiv(task.task_date, 'float-right'));

    // each element created above is appended to li
    li.appendChild(flexDiv);
    li.appendChild(descriptionDiv);
    li.appendChild(div);

    // li is appended to ul
    tasksList.appendChild(li);
    }
},


// function to create li
createLi: function(task) {
    let li = document.createElement('li');
    li.id = task.id;
    li.className = 'list-group-item task-bg';
    return li;
},


// function to create task title or description div
createSingleElement: function(element, cls, value){
    let elem = document.createElement(element);
    elem.className = cls;
    let text = document.createTextNode(value);
    elem.appendChild(text);
    return elem;
},


// function to create checkbox
createCheckbox: function(task){
    let checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    if(task.complete){
        checkBox.setAttribute('checked', 'checked');
    }
    checkBox.setAttribute('onchange', 'todoList.onCheck(this)');
    checkBox.className = 'px-2';
    return checkBox;
},



// function to create edit or delete button
createEditOrDeleteBtn: function(cls, onclick){
    let btn = document.createElement('i');
    btn.className = cls;
    btn.setAttribute('onclick', onclick);
    return btn;
},


// function to create date or time element
dateOrTimeDiv: function(taskDateOrTime = '', divClass) {
    let taskDateOrTimeDiv = document.createElement('div');
    let text = document.createTextNode(taskDateOrTime);
    taskDateOrTimeDiv.className = divClass;
    taskDateOrTimeDiv.appendChild(text);
    taskDateOrTimeDiv.setAttribute('onclick', 'todoList.taskOnClick(this)');
    return taskDateOrTimeDiv;
},


 // function to add a new task
addTask: function(){
let taskForm = document.querySelector('#taskForm');
    taskForm.addEventListener('submit', function (e){
        e.preventDefault();
        let title = document.querySelector('#taskTitle').value;
        let description = document.querySelector('#taskDescription').value;
        let task_date = document.querySelector('#taskDate').value;
        let task_time = document.querySelector('#taskTime').value;
        if(task_date){
            task_date = todoList.formatTaskDate(task_date);
        }
        if(task_time){
            task_time = todoList.formatTaskTime(task_time);
        }
        ajaxPostRequest('save_todo/', {title, description, task_date, task_time});
        taskForm.reset();
    });
},


// function to format task date to local date
formatTaskDate: function(task_date) {
    let day = task_date.slice(task_date.lastIndexOf('-')+1);
    if(day.length === 1){
    day = '0' + day;
    }
    let month = task_date.slice(task_date.indexOf('-')+1, task_date.lastIndexOf('-'));
    if(month.length === 1){
    month = '0' + month;
    }
    let year = task_date.slice(0, task_date.indexOf('-'));
    task_date = day + '-' + month + '-' + year;
    return task_date;
},


// function to format task time to local time
formatTaskTime: function(task_time){
    let hour = task_time.slice(0, task_time.indexOf(':'));
    let minutes = task_time.slice(task_time.indexOf(':')+1);
    if(hour > '12'){
        hour = Number(hour);
        hour -= 12;
        hour = '0' + hour.toString();
        minutes += ' PM';
    } else if(hour === '12'){
        minutes += ' PM';
    } else if(hour === '00'){
        hour = '12';
        minutes += ' AM';
    } else {
        minutes += ' AM';
    }
    task_time = hour + ':' + minutes;
    return task_time;
},


// function to create button
colDiv: document.createElement('div'),
createBtn: function(btnName, id, className, btnHolder, onClick){
    todoList.colDiv.className = 'text-sm-right text-center float-right';
    let btn = document.createElement('button');
    let _btnName = document.createTextNode(btnName);
    btn.appendChild(_btnName);
    btn.id = id;
    btn.className = className;
    btn.setAttribute('onclick', onClick);
    todoList.colDiv.appendChild(btn);
},


// function to fill form when task's li is clicked
editBtnOnClick: function (_this) {
    let taskForm = document.querySelector('#taskForm');
    taskForm.reset();
    document.querySelector('#checkboxHolder').style.display = 'block';
    document.querySelector('#taskId').value = _this.parentElement.parentElement.id;
    document.querySelector('#taskTitle').value = _this.parentElement.parentElement.children[0].children[1].innerText;
    document.querySelector('#taskDescription').value = _this.parentElement.parentElement.children[1].innerText;

    let taskTime = _this.parentElement.parentElement.children[2].children[0].innerText;
    let taskDate = _this.parentElement.parentElement.children[2].children[1].innerText;

    if(taskDate !== ''){
        todoList.changeDateFormat(taskDate);
    }
    if(taskTime  !== ''){
        todoList.changeTimeFormat(taskTime)
    }
    document.querySelector('#formCheckbox').checked = _this.parentElement.children[0].checked;
    todoList.toggleTaskOnClickButtons(taskForm);
},


// function to change date format for date input when task li is clicked
changeDateFormat: function(taskDate){
    let year = taskDate.slice(taskDate.lastIndexOf('-')+1);
    let month = taskDate.slice(taskDate.indexOf('-')+1, taskDate.lastIndexOf('-'));
    let day = taskDate.slice(0, taskDate.indexOf('-'));
    document.querySelector('#taskDate').value = year + "-" + month + "-" + day;
},


// function to change date format for date input when task li is clicked
changeTimeFormat: function(taskTime){
    let hour = taskTime.slice(0, taskTime.indexOf(':'));
    let minutes = taskTime.substr(taskTime.indexOf(':') + 1, 2);
    if(taskTime.includes('PM')){
        hour = Number(hour);
        if(hour === 12){
            hour = 12;
        } else{
            hour += 12;
        }
    }else if(taskTime.includes('AM') && Number(hour) === 12){
        hour = Number(hour);
        hour = '00';
    }
    document.querySelector('#taskTime').value = hour +':'+ minutes;
},


// function to remove add button and create cancel and edit button, and to scroll smoothly to form for taskOnClick function
toggleTaskOnClickButtons: function(taskForm){
    try{
        document.querySelector('#saveBtn').remove();
    } catch(err){
        console.log(err);
        document.querySelector('#editBtn').remove();
        document.querySelector('#cancelBtn').remove();
    } finally{
        todoList.createBtn(
          'Cancel',
               'cancelBtn',
        'btn btn-secondary btn-sm',
        '#editBtnHolder',
         'todoList.cancelUpdate()'
        );
        todoList.createBtn(
          'Edit',
               'editBtn',
        'btn btn-primary btn-sm ml-3',
        '#editBtnHolder',
         'todoList.updateTask()'
        );
        document.querySelector('#editBtnHolder').appendChild(todoList.colDiv);
        taskForm.scrollIntoView({behavior: 'smooth'});
    }
},


// function to update task
updateTask: function (){
    let taskForm = document.querySelector('#taskForm');
    let task_id = document.querySelector('#taskId').value;
    let title = document.querySelector('#taskTitle').value;
    let description = document.querySelector('#taskDescription').value;
    let checkBoxValue = document.querySelector('#formCheckbox').checked;
    let task_date = document.querySelector('#taskDate').value;
    let task_time = document.querySelector('#taskTime').value;
    if(task_date){
        task_date = todoList.formatTaskDate(task_date);
    }
    if(task_time){
        task_time = todoList.formatTaskTime(task_time);
    }
    let task = {
        id: task_id,
        title: title,
        description: description,
        complete: checkBoxValue,
        task_date: task_date,
        task_time: task_time
    };
    ajaxPostRequest('update_todo/', task);
    todoList.toggleUpdateButtons(taskForm);
},


// function to remove cancel and edit buttons and create add button for updateTask function
toggleUpdateButtons: function(taskForm) {
    document.querySelector('#editBtn').remove();
    document.querySelector('#cancelBtn').remove();
    try{
        document.querySelector('#saveBtn').remove();
    }catch(err){
        console.log(err);
        todoList.createBtn(
        'Add',
        'saveBtn',
        'btn btn-primary btn-sm',
        '#saveBtnHolder',
        ''
        );
    }
    document.querySelector('#checkboxHolder').style.display = 'none';
    taskForm.reset();
},


// function to update complete status when checkbox is clicked
onCheck: function (_this) {
    let task_id = _this.parentElement.parentElement.id;
    let title = _this.parentElement.parentElement.children[0].children[1].innerText;
    let description = _this.parentElement.parentElement.children[1].innerText;
    let checkBoxValue = _this.checked;
    let task_date = _this.parentElement.parentElement.children[2].children[1].innerText;
    let task_time = _this.parentElement.parentElement.children[2].children[0].innerText;
    let task = {
        id: task_id,
        title: title,
        description: description,
        complete: checkBoxValue,
        task_date: task_date,
        task_time: task_time
    };
    ajaxPostRequest('update_todo/', task);
},


// function to reset form and, remove cancel and edit buttons when cancel button is clicked
cancelUpdate: function () {
    let taskForm = document.querySelector('#taskForm');
    try{
        document.querySelector('#editBtn').remove();
        document.querySelector('#cancelBtn').remove();
    } catch (e) {
        document.querySelector('#saveBtn').remove();
    } finally {
        todoList.createBtn(
        'Add',
        'saveBtn',
        'btn btn-primary btn-sm',
        '#saveBtnHolder',
          ''
        );
        document.querySelector('#checkboxHolder').style.display = 'none';
        taskForm.reset();
    }
},


// function to delete task
deleteTask: function(_this){
    let taskId = _this.parentElement.parentElement.id;
    let httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
        let data = JSON.parse(this.response);
        console.log(this.response);
        _this.parentElement.parentElement.remove();
            // if(!data.msg){
            //     _this.parentElement.parentElement.remove();
            // }
        if(data.tasks_count === 0){
            let tasksList = document.querySelector('#tasksList');
            tasksList.innerHTML = 'No tasks to show';
        }
    };
    httpRequest.open('DELETE', "delete_todo" + "/" + taskId);
    httpRequest.setRequestHeader('X-CSRFToken', csrftoken);
    httpRequest.send();
},


};


// function called to bind submit event with form when page loads for first time
todoList.addTask();
