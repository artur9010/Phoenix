/**
 * Created by artur9010 on 19.07.2016.
 */

//node.js imports
const waff = require("waff-query/dist/waff-query.min.js");
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
    el.on("click", function (e) {
        console.log(this.css("background-color"));
        console.log(this);
        colorpicker.setColor(this.css("background-color"));
    });
});

//Utils
function sendNotification(body) {
    new Notification("Phoenix", {body: body})
}

//Form
var submitted = false;
waff.q("#login-form").on("submit", function (e) {
    e.preventDefault();
    if(submitted === false) login_to_messenger();
});

//Color changer
function login_to_messenger() {
    submitted = true;
    waff.q("#info").html("Logging in...");
    waff.q("#login-button").disabled = true; //disable login button
    messenger({
        email: waff.q("#username").value,
        password: waff.q("#password").value
    }, function callback(err, api) {

        if (err) {
            submitted = false;
            waff.q("#info").html(err.error);
            waff.q("#login-button").disabled = false; //enable login button if error
            return console.error(err);
        }

        waff.q("#info").html("Loading thread list...");

        // Load thread list from facebook shitty servers
        api.getThreadList(0, 50, function (err, arr) {
            if (err) {
                waff.q("#info").html("Error loading thread list.");
                submitted = false;
                console.error(err);
            } else {
              for (prot in arr) {
                  var conversationName;
                  var conversationImage;
                  var conversatonID;
                  if (arr[prot]["isCanonicalUser"]) { //is user
                      api.getUserInfo([arr[prot]["participantIDs"][0]], function (err, res) {
                          if (err) return console.error(err);
                          for (var prop in res) {
                              conversationName = res[prop].name;
                              conversationImage = res[prop].thumbSrc;
                              conversatonID = prop;
                              addConversation(conversatonID, conversationName, conversationImage);
                          }
                      });
                  } else { //is group
                      conversationName = arr[prot]["name"];
                      conversationImage = arr[prot]["imageSrc"];
                      conversatonID = arr[prot]["threadID"];
                      addConversation(conversatonID, conversationName, conversationImage);
                  }
              }
            }

            waff.q("#info").html("Successfully logged in.");

            // Set .5 second timeout
            setTimeout(function(){
                // Hide login screen and show color changer.
                waff.q("#login-screen").css("display", "none");
                waff.q("#colorchanger").css("display", "");
            }, 500);
        });

        function addConversation(id, name, image) {
            if (name !== "") { //do not display pages and unnamed conversations
                if (image == "" || typeof image == undefined || image == null) {
                    image = "img/default.jpg";
                }
                var conversationDOM = waff.e("li.list-group-item.conversation#" + id);
                var conversationDOMimage = waff.e("img.img-circle.media-object.pull-left");
                conversationDOMimage.attr("width", 32);
                conversationDOMimage.attr("height", 32);
                conversationDOMimage.attr("src", image);
                var conversationDOMname = waff.e(".media-body");
                api.getThreadInfo(id, function(err,info){
                  if(err) return console.error(err);
                  conversationDOM.css({color: info.color});
                })
                conversationDOMname.html("<strong>" + name + "</strong>");
                conversationDOM.append(conversationDOMimage);
                conversationDOM.append(conversationDOMname);
                conversationDOM.on("click", function () {
                    waff.qq('.conversation.active').forEach((e)=>e.classList.remove('active'));
                    this.classList.add('active');
                });
                waff.q("#conversations").append(conversationDOM);
            }
        }

        waff.q("#change-button").on("click", function () {
            changeColor();
        });

        function changeColor() {
            var id = waff.q(".conversation.active").id;
            api.changeThreadColor(colorpicker.getHexString().toString(), id.toString(), function callback(err) {
                if (err){
                    sendNotification("Error changing color...");
                    return console.error(err);
                }
                waff.q('.conversation.active .media-body').css({color: colorpicker.getHexString()})
                sendNotification("Color changed successfully :D");
            });
        }
    })
}
