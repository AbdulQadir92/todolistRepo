let registerUrlHolder = document.querySelector('#registerUrlHolder');
let postUrl = registerUrlHolder.getAttribute('data-postUrl');
postUrl = postUrl.slice(1);

document.querySelector('#registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let firstName = document.querySelector('#firstName').value;
    let lastName = document.querySelector('#lastName').value;
    let email = document.querySelector('#email').value;
    let username = document.querySelector('#username').value;
    let password1 = document.querySelector('#password1').value;
    let password2 = document.querySelector('#password2').value;

    let user = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        username: username,
        password1: password1,
        password2: password2
    };
    ajaxPostRequest('', user);
    // document.querySelector('#registerForm').reset();
});

