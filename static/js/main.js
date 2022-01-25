
// Ajax request to get all tasks
function ajaxGetRequest(url) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
        let data = JSON.parse(this.response);
        todoList.createElement(data);
    };
    httpRequest.open('GET', url);
    httpRequest.send();
}
ajaxGetRequest('all_todos/');

// function to get csrf_token from a cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// csrf_token
const csrftoken = getCookie('csrftoken');

// Ajax request to save a task
function ajaxPostRequest(url, data){
    let httpReqeust = new XMLHttpRequest();
    httpReqeust.onload = function () {
        console.log(this.response);
        ajaxGetRequest('all_todos/');
    };
    httpReqeust.open('POST', url);
    httpReqeust.setRequestHeader('Content-type', 'application/json');
    httpReqeust.setRequestHeader('X-CSRFToken', csrftoken);
    httpReqeust.send(JSON.stringify(data));
}

// Ajax request to delete a task
function ajaxDeleteRequest(url, id){
    let httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
        console.log(this.response);
    };
    httpRequest.open('DELETE', url + "/" + id);
    httpRequest.setRequestHeader('X-CSRFToken', csrftoken)
    httpRequest.send();
}


// function to create li that is appended to ul
const todoList = {
 createElement: function(tasks){
    let tasksList = document.querySelector('#tasksList');
    tasksList.innerHTML = '';

    tasks.sort();
    tasks.reverse();
    for(let task of tasks){
        let li = document.createElement('li');
        li.id = task.id;
        li.className = 'list-group-item li-bg';
        li.setAttribute('onmouseover', 'todoList.taskHover(this)');
        li.setAttribute('onmouseleave', 'todoList.removeHover(this)');
        // li.setAttribute('onclick', 'todoList.taskOnClick(this)');

        let deleteBtn = document.createElement('i');
        deleteBtn.className = 'fas fa-times float-right mt-3 p-2';
        deleteBtn.setAttribute('onclick', 'todoList.deleteTask(this)');

        let taskTitle = document.createElement('h4');
        let taskTitleText = document.createTextNode(task.title);
        taskTitle.appendChild(taskTitleText);
        taskTitle.setAttribute('onclick', 'todoList.taskOnClick(this)');

        let taskDescription = document.createElement('div');
        let taskDescriptionText = document.createTextNode(task.description);
        taskDescription.appendChild(taskDescriptionText);
        taskDescription.setAttribute('onclick', 'todoList.taskOnClick(this)');

        li.appendChild(deleteBtn);
        li.appendChild(taskTitle);
        li.appendChild(taskDescription);
        tasksList.appendChild(li);
    }
 },

 // function to add a new task at frontend
  addTask: function(){
      let taskForm = document.querySelector('#taskForm');
      taskForm.addEventListener('submit', function (e){
          e.preventDefault();
          let title = document.querySelector('#taskTitle').value;
          let description = document.querySelector('#taskDescription').value;
          taskForm.reset();
          ajaxPostRequest('save_todo/', {title, description});
      });
  },


// function to create button
  createBtn: function(btnName, id, className, btnHolder, onClick){
        let btn = document.createElement('button');
        let _btnName = document.createTextNode(btnName);
        btn.appendChild(_btnName);
        btn.id = id;
        btn.className = className;
        btn.setAttribute('onclick', onClick);
        document.querySelector(btnHolder).appendChild(btn);
  },


// function to fill form when task's li is clicked
  taskOnClick: function (_this) {
        let taskForm = document.querySelector('#taskForm');
        document.querySelector('#taskId').value = _this.parentElement.id;
        document.querySelector('#taskTitle').value = _this.parentElement.children[1].innerText;
        document.querySelector('#taskDescription').value = _this.parentElement.children[2].innerText;
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
            'btn btn-secondary mx-4',
            '#editBtnHolder',
             'todoList.cancelUpdate()'
            );
            todoList.createBtn(
              'Edit',
                   'editBtn',
            'btn btn-primary',
            '#editBtnHolder',
             'todoList.updateTask()'
            );
            taskForm.scrollIntoView({behavior: 'smooth'});
        }
  },

// function to update task
  updateTask: function () {
      let taskForm = document.querySelector('#taskForm');
      let task_id = document.querySelector('#taskId').value;
      let title = document.querySelector('#taskTitle').value;
      let description = document.querySelector('#taskDescription').value;
      let task = {
        id: task_id,
        title: title,
        description: description
      };
      ajaxPostRequest('update_todo/', task);
      document.querySelector('#editBtn').remove();
      document.querySelector('#cancelBtn').remove();
      todoList.createBtn(
          'Add',
                'saveBtn',
          'btn btn-primary',
          '#saveBtnHolder',
            'todoList.addTask()'
      );
      taskForm.reset();
  },

// function to reset form and, remove cancel and edit buttons when cancel button is clicked
  cancelUpdate: function () {
      let taskForm = document.querySelector('#taskForm');
      try{
          document.querySelector('#editBtn').remove();
          document.querySelector('#cancelBtn').remove();
          todoList.createBtn(
          'Add',
                'saveBtn',
          'btn btn-primary',
          '#saveBtnHolder',
            'todList.addTask()'
          );
      }catch(err){
          console.log(err);
      }
      taskForm.reset();
  },
// function to delete task
  deleteTask: function(_this){
    let taskId = _this.parentElement.id;
    _this.parentElement.remove();
    ajaxDeleteRequest('delete_todo', taskId);
    todoList.cancelUpdate();
  },
  taskHover: function(_this){
     _this.classList.add('active');
  },
  removeHover: function(_this){
      _this.classList.remove('active');
  }
};

// function called to bind submit event with form when page loads for first time
todoList.addTask();
