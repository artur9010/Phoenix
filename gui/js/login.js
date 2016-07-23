/**
 * Created by artur9010 on 19.07.2016.
 */

const waff = require("waff-query");
const messenger = require("facebook-chat-api");

waff.q("#login-form").on("submit", function(e){
    e.preventDefault();
    login();
});

function login(){
    waff.q("#error").html("Tryin to log in...");
    messenger({email: waff.q("#username").value, password: waff.q("#password").value}, function callback (err, api) {
        if(err){
            waff.q("#error").html(err.error)
            return console.error(err.error);
        }
        waff.q("#error").html("Ok :D");
        window.location.href = "index.html?username=" + waff.q("#username").value + "&password=" + waff.q("#password").value;
    });
}