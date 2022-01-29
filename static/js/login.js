let loginUrlHolder = document.querySelector('#loginUrlHolder');
let loginUrl = loginUrlHolder.getAttribute('data-loginUrl');
loginUrl = loginUrl.slice(1);

let loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let username = document.querySelector('#loginUsername').value;
    let password = document.querySelector('#loginPassword').value;
    let loginDetails = {username: username, password: password};

    ajaxPostRequest('', loginDetails);
});




function createMessage(msg){
    if(msg.includes('logged in')){
        loginForm.reset();
    } else{
        let parent = document.querySelector('#passwordMsg');
        let small = document.createElement('div');
        let message = document.createTextNode(msg);
        small.appendChild(message);
        parent.appendChild(small);

        setTimeout(function () {
           document.querySelector('#passwordMsg').innerHTML = '';
        }, 3000);
    }
}


