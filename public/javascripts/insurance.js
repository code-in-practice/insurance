/**
 * Created by zsj on 16-6-13.
 */

$(function () {
    document.querySelector('#login').onclick = function () {
        var username= document.getElementById('username').value;
        var password= document.getElementById('password').value;
        var captcha= document.getElementById('captcha').value;

        var url = "/login";

        var formData = {
            username: username,
            password: password,
            captcha: captcha
        };

        $.post(url, formData, function (data) {
            console.log(data);
            window.location.href='/user';
        })
    };
});

function  refreshPNG(thisDOM) {
    var t = new Date().getTime();
    thisDOM.src = "/login/png?"+t;
}


