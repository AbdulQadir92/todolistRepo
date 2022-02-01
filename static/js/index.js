// const getUrl = urlHolder.getAttribute('data-getUrl');

ajaxGetRequest('all_todos/');

// function to create li that is appended to ul
const todoList = {
 createElement: function(tasks){
    let tasksList = document.querySelector('#tasksList');
    tasksList.innerHTML = '';
    if(tasks.length === 0){
            let tasksList = document.querySelector('#tasksList');
            tasksList.innerHTML = 'No tasks to show';
    }
    tasks.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
    tasks.reverse();
    for(let task of tasks){
        // console.log(task.task_date);
        // console.log(task.task_time);

        let li = document.createElement('li');
        li.id = task.id;
        li.className = 'list-group-item li-bg';
        li.setAttribute('onmouseover', 'todoList.taskHover(this)');
        li.setAttribute('onmouseleave', 'todoList.removeHover(this)');

        let deleteBtn = document.createElement('i');
        deleteBtn.className = 'fas fa-times float-right top-margin';
        deleteBtn.setAttribute('onclick', 'todoList.deleteTask(this)');

        let checkBox = document.createElement('input');
        checkBox.setAttribute('type', 'checkbox');
        if(task.complete){
            checkBox.setAttribute('checked', 'checked');
        }
        checkBox.setAttribute('onchange', 'todoList.handleCheck(this)');
        checkBox.className = 'float-left top-margin';

        let taskTitle = document.createElement('h4');
        taskTitle.className = 'ml-4';
        let taskTitleText = document.createTextNode(task.title);
        taskTitle.appendChild(taskTitleText);
        taskTitle.setAttribute('onclick', 'todoList.taskOnClick(this)');

        let taskDescription = document.createElement('div');
        let taskDescriptionText = document.createTextNode(task.description);
        taskDescription.appendChild(taskDescriptionText);
        taskDescription.setAttribute('onclick', 'todoList.taskOnClick(this)');


        li.appendChild(checkBox);
        li.appendChild(deleteBtn);
        li.appendChild(taskTitle);
        li.appendChild(taskDescription);
        // li.appendChild(taskDatetime);
        todoList.datetimeToString(task, li);
        tasksList.appendChild(li);
    }
 },

datetimeToString: function(task, li) {
    let div = document.createElement('div');
    if(task.task_time){
        // console.log(task.task_time);

        let tempTime = task.task_time;
        let hoursAndMinutes = tempTime.slice(0, tempTime.lastIndexOf(':'));
        let amOrpm = tempTime.slice(tempTime.length-2);
        let time = hoursAndMinutes +' '+ amOrpm;
        // console.log(time);

        let taskTime = document.createElement('div');
        let taskTimeText = document.createTextNode(time);
        taskTime.className = 'float-right';
        taskTime.appendChild(taskTimeText);
        taskTime.setAttribute('onclick', 'todoList.taskOnClick(this)');
        div.appendChild(taskTime);
    } else{
        let taskTime = document.createElement('div');
        let taskTimeText = document.createTextNode('');
        taskTime.className = 'float-right';
        taskTime.appendChild(taskTimeText);
        taskTime.setAttribute('onclick', 'todoList.taskOnClick(this)');
        div.appendChild(taskTime);
    }

    if(task.task_date){
          let d = new Date(task.task_date);

          let day = d.getDate();
          let month = d.getMonth() + 1;
          let year = d.getFullYear();

          let date = day + '-' + month + '-' + year;

        let taskDate = document.createElement('div');
        let taskDateText = document.createTextNode(task.task_date);
        taskDate.className = 'float-right mr-3';
        taskDate.appendChild(taskDateText);
        taskDate.setAttribute('onclick', 'todoList.taskOnClick(this)');
        div.appendChild(taskDate);
    }else{
        let taskDate = document.createElement('div');
        let taskDateText = document.createTextNode('');
        taskDate.className = 'float-right mr-3';
        taskDate.appendChild(taskDateText);
        taskDate.setAttribute('onclick', 'todoList.taskOnClick(this)');
        div.appendChild(taskDate);
    }
    li.appendChild(div);
},

 // function to add a new task at frontend
  addTask: function(){
      let taskForm = document.querySelector('#taskForm');
      taskForm.addEventListener('submit', function (e){
          e.preventDefault();
          let title = document.querySelector('#taskTitle').value;
          let description = document.querySelector('#taskDescription').value;
          let task_date = document.querySelector('#taskDate').value;
          let task_time = document.querySelector('#taskTime').value;
          // console.log(task_date +" "+ task_time);
          let date;
          if(task_date){
              date = new Date(task_date +" "+ task_time);
              task_date = date.toLocaleDateString();
              console.log(date.toLocaleDateString());
          }
          if(task_time){
              if(task_date){
                date = new Date( task_date +" "+ task_time);
              }else{
                 date = new Date('2022-01-01' +" "+ task_time);
              }
              task_time = date.toLocaleTimeString();
              console.log(date.toLocaleTimeString());
          }

          ajaxPostRequest('save_todo/', {title, description, task_date, task_time});
          taskForm.reset();
      });
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
  taskOnClick: function (_this) {
        let taskForm = document.querySelector('#taskForm');
        taskForm.reset();
        document.querySelector('#checkboxHolder').style.display = 'block';
        document.querySelector('#taskId').value = _this.parentElement.id;
        document.querySelector('#taskTitle').value = _this.parentElement.children[2].innerText;
        document.querySelector('#taskDescription').value = _this.parentElement.children[3].innerText;

        console.log(_this.parentElement.children[4].children[0].innerText);
        console.log(_this.parentElement.children[4].children[1].innerText);

        if(_this.parentElement.children[4].children[0].innerText !== ''){
            let tempTime = _this.parentElement.children[4].children[0].innerText;
            let index = tempTime.indexOf(':');
            let tempHour = tempTime.slice(0, index);
            let minutes = tempTime.substr(index + 1, 2);
            let hour = tempHour;

            if(tempHour.length === 1 && tempHour[0] !== '0'){
                hour = '0' + tempHour;
            }
            if(tempTime.includes('PM')){
                hour = Number(hour);
                if(hour === 12){
                    hour = 12;
                } else{
                    hour += 12;
                }
            }else if(tempTime.includes('AM') && Number(hour) === 12){
                hour = Number(hour);
                hour = '00';
            }

            let time = hour +':'+ minutes;
            document.querySelector('#taskTime').value = time;
        }

        if(_this.parentElement.children[4].children[1].innerText !== ''){
            // console.log(_this.parentElement.children[4].children[1].innerText);
            let str = _this.parentElement.children[4].children[1].innerText;
            let tempMonth = str.slice(0, str.indexOf('/'));
            let month;
            if(tempMonth.length === 1){
                month = '0' + tempMonth;
            } else {
                month = tempMonth
            }
            let tempDay = str.slice(str.indexOf('/') + 1, str.lastIndexOf('/'));
            let day;
            if(tempDay.length === 1){
                day = '0' + tempDay;
            }else{
                day = tempDay;
            }
            let year = str.substr(str.lastIndexOf('/') + 1, 4);
            let date = year + "-" + month + "-" + day;
            console.log(date);

            document.querySelector('#taskDate').value = date;
        }

        document.querySelector('#formCheckbox').checked = _this.parentElement.children[0].checked;
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
            'btn btn-secondary',
            '#editBtnHolder',
             'todoList.cancelUpdate()'
            );
            todoList.createBtn(
              'Edit',
                   'editBtn',
            'btn btn-primary ml-3',
            '#editBtnHolder',
             'todoList.updateTask()'
            );
            document.querySelector('#editBtnHolder').appendChild(todoList.colDiv);
            taskForm.scrollIntoView({behavior: 'smooth'});
        }
  },

// function to update task
  updateTask: function () {
      let taskForm = document.querySelector('#taskForm');
      let task_id = document.querySelector('#taskId').value;
      let title = document.querySelector('#taskTitle').value;
      let description = document.querySelector('#taskDescription').value;
      let checkBoxValue = document.querySelector('#formCheckbox').checked;
      let task_date = document.querySelector('#taskDate').value;
      let task_time = document.querySelector('#taskTime').value;
      console.log(task_date +" "+ task_time);
      let date;
      if(task_date){
          date = new Date(task_date +" "+ task_time);
          task_date = date.toLocaleDateString();
          console.log(date.toLocaleDateString());
      }
      if(task_time){
          if(task_date){
            date = new Date( task_date +" "+ task_time);
          }else{
             date = new Date('2022-01-01' +" "+ task_time);
          }
          task_time = date.toLocaleTimeString();
          console.log(date.toLocaleTimeString());
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
      document.querySelector('#editBtn').remove();
      document.querySelector('#cancelBtn').remove();

      try{
         document.querySelector('#saveBtn').remove();
      }catch(err){
          console.log(err);
          todoList.createBtn(
      'Add',
            'saveBtn',
      'btn btn-primary',
      '#saveBtnHolder',
        // 'todoList.addTask()'
              ''
          );
      }

      document.querySelector('#checkboxHolder').style.display = 'none';
      taskForm.reset();
  },

  handleCheck: function (_this) {
    let task_id = _this.parentElement.id;
    let title = _this.parentElement.children[2].innerText;
    let description = _this.parentElement.children[3].innerText;
    let checkBoxValue = _this.parentElement.children[0].checked;
    // let task_date = document.querySelector('#taskDate').value;
    // let task_time = document.querySelector('#taskTime').value;
    let task_date = _this.parentElement.children[4].children[1].innerText;
    let task_time = _this.parentElement.children[4].children[0].innerText;
    console.log(task_date +" "+ task_time);

    let date;
    if(task_date !== ''){

        let tempDate = task_date;
        console.log(tempDate);
        let month = tempDate.slice(0, tempDate.indexOf('/'));
        console.log(month);
        if(month.length === 1){
            month = '0' + month;
            console.log(month);
        }
        let day = tempDate.slice(tempDate.indexOf('/')+1, tempDate.lastIndexOf('/'));
        if(day.length === 1){
            day = '0' + day;
            console.log(day);
        }
        let year = tempDate.substr(tempDate.lastIndexOf('/'), 5);
        console.log(year);
        let newDate = year + '-' + month + '-' + day;
        console.log(newDate);

        date = new Date(newDate +" "+ task_time);
        task_date = date.toLocaleDateString();
    }
    if(task_time !== ''){
        if(task_date !== ''){
            date = new Date( task_date +" "+ task_time);
        }else{
            date = new Date('2022-01-01' +" "+ task_time);
        }
        task_time = date.toLocaleTimeString();
    }


    let task = {
        id: task_id,
        title: title,
        description: description,
        complete: checkBoxValue,
        task_date: task_date,
        task_time: task_time
    };
    console.log(task);
    ajaxPostRequest('update_todo/', task);
  },

// function to reset form and, remove cancel and edit buttons when cancel button is clicked
  cancelUpdate: function () {
      let taskForm = document.querySelector('#taskForm');
      try{
        document.querySelector('#editBtn').remove();
        document.querySelector('#cancelBtn').remove();
      } catch (e) {
          console.log(e);
          document.querySelector('#saveBtn').remove();
      }
      todoList.createBtn(
  'Add',
        'saveBtn',
  'btn btn-primary',
  '#saveBtnHolder',
    // 'todoList.addTask()'
          ''
      );

      document.querySelector('#checkboxHolder').style.display = 'none';
      taskForm.reset();
  },
// function to delete task
  deleteTask: function(_this){
    let taskId = _this.parentElement.id;

    let httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
        let data = JSON.parse(this.response);
        console.log(this.response);
        if(!data.msg){
            _this.parentElement.remove();
        }

        if(data.tasks_count === 0){
            let tasksList = document.querySelector('#tasksList');
            tasksList.innerHTML = 'No tasks to show';
        }
    };
    httpRequest.open('DELETE', "delete_todo" + "/" + taskId);
    httpRequest.setRequestHeader('X-CSRFToken', csrftoken);
    httpRequest.send();

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
