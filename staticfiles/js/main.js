const urlHolder = document.querySelector('#urlHolder');
const path = urlHolder.getAttribute('data-path');

// Ajax request to get all tasks
function ajaxGetRequest(url) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
        let data = JSON.parse(this.response);
        if(path === '/'){
            todoList.createElement(data);
            // console.log(data);
        }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
}

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
        console.log(path);

        if(path === '/'){
            ajaxGetRequest('all_todos/');
        }

        let msg = this.response;
        if(path === '/accounts/login/'){
            if(msg.includes('logged in')){
                console.log('logged in');
                loginForm.reset();
                window.location.href = '/'
            }
            createMessage(msg, '#passwordMsg');
        }
        if(path === '/accounts/register/'){
            if(msg.includes('User created')){
                console.log('User created');
                document.querySelector('#registerForm').reset();
                window.location.href = '/';
            } else if(msg.includes('Username already taken')){
                createMessage(msg, '#usernameMsgHolder');
            } else{
                createMessage(msg, '#passwordMsgHolder');
            }
        }

    };
    httpReqeust.open('POST', url);
    httpReqeust.setRequestHeader('Content-type', 'application/json');
    httpReqeust.setRequestHeader('X-CSRFToken', csrftoken);
    httpReqeust.send(JSON.stringify(data));
}

function createMessage(msg, msgHolder){
    let parent = document.querySelector(msgHolder);
    let small = document.createElement('div');
    let message = document.createTextNode(msg);
    small.appendChild(message);
    parent.appendChild(small);

    setTimeout(function () {
       document.querySelector(msgHolder).innerHTML = '';
    }, 5000);
}

function search(_this){
    let list = document.querySelectorAll('#tasksList li');
    let value = _this.value.toLowerCase();

    for(let i = 0; i < list.length; i++){
        let text = list[i].textContent.toLowerCase();
        if(text.indexOf(value) !== -1){
            list[i].style.display = '';
        } else {
            list[i].style.display = 'none';
        }
    }
}

