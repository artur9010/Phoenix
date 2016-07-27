/**
 * Created by artur9010 on 19.07.2016.
 */

//node.js imports
const waff = require("waff-query");
const messenger = require("facebook-chat-api");
const ColorPicker = require("simple-color-picker");

//Color picker
var colorpicker = new ColorPicker({
    color: '#FF0000',
    el: document.getElementById("colorpicker"),
    height: 250,
    width: 249,
    background: '#FFFFFF'
});

waff.qq(".color-block").forEach(function (el) {
    el.on("click", function(e){
        console.log(this.css("background-color"));
        console.log(this);
        colorpicker.setColor(this.css("background-color"));
    });
});

//Utils
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

waff.q("#login-form").on("submit", function(e){
    e.preventDefault();
    login_to_messenger();
});

//Color changer
function login_to_messenger() {
    messenger({
        email: waff.q("#username").value,
        password: waff.q("#password").value
    }, function callback(err, api) {
        if (err) {
            return console.error(err);
        }

        // Display color changer
        waff.q("#login-screen").css("display", "none");
        waff.q("#colorchanger").css("display", "");

        api.getThreadList(0, 50, function (err, arr) {
            if(err){
                return console.error(err);
            }
            for(prot in arr){
                (function(){
                    var conversationName;
                    var conversationImage;
                    var conversatonID;
                    if(arr[prot]["isCanonicalUser"]){ //is user
                        api.getUserInfo([arr[prot]["participantIDs"][0]], function(err, res){
                            if(err) return console.error(err);
                            for(var prop in res) {
                                conversationName = res[prop].name;
                                conversationImage = res[prop].thumbSrc;
                                conversatonID = prop;
                                addConversation(conversatonID, conversationName, conversationImage);
                            }
                        });
                    }else{ //is group
                        conversationName = arr[prot]["name"];
                        conversationImage = arr[prot]["imageSrc"];
                        conversatonID = arr[prot]["threadID"];
                        addConversation(conversatonID, conversationName, conversationImage);
                    }
                }());

            }
        });

        function addConversation(id, name, image){
            if(name !== ""){
                if(image == "" || typeof image == undefined){
                    image = "img/default.jpg"; //todo: not working?
                }
                var conversationDOM = waff.e("li.list-group-item.conversation#" + id);
                var conversationDOMimage = waff.e("img.img-circle.media-object.pull-left");
                conversationDOMimage.attr("width", 32);
                conversationDOMimage.attr("height", 32);
                conversationDOMimage.attr("src", image);
                var conversationDOMname = waff.e(".media-body");
                conversationDOMname.html("<strong>" + name + "</strong>");
                conversationDOM.append(conversationDOMimage);
                conversationDOM.append(conversationDOMname);
                conversationDOM.on("click", function(){
                    waff.qq('.conversation.active').forEach((e)=>e.classList.remove('active'));
                    this.classList.add('active');
                });
                waff.q("#conversations").append(conversationDOM);
            }
        }

        waff.q("#change-button").on("click", function(){
            changeColor();
        });

        function changeColor(){
            var id = waff.q(".conversation.active").id;
            api.changeThreadColor(colorpicker.getHexString().toString(), id.toString(), function callback(err){
                if(err) return console.error(err);
            });
        }
    })
}