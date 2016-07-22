/**
 * Created by artur9010 on 19.07.2016.
 */

const $ = require("jquery");
const messenger = require("facebook-chat-api");

$("#login-form").on("submit", function(e){
    e.preventDefault();
    login();
})

function login(){
    messenger({email: $("#username").val(), password: $("#password").val()}, function callback (err, api) {
        if(err){
            $("#error").html(err.toString())
            $("#error").show();
            return console.error(err);
        }
        window.location.href = "index.html?username=" + $("#username").val() + "&password=" + $("#password").val();
    });
}