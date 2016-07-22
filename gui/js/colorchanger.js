/**
 * Created by artur9010 on 19.07.2016.
 */

const messenger = require("facebook-chat-api")

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function login_to_messenger(){
    messenger({email: getParameterByName("username"), password: getParameterByName("password")}, function callback (err, api) {
        if(err){
            return console.error(err);
        }
        //load_conversations()
        api.getThreadList(0, 100, function(err, arr){
            console.log(arr)
            for (var con in arr) {
                if (arr.hasOwnProperty(con)) {
                    console.log(arr[con])
                    //console.log("tryin to load conversations 2")
                    var conversation = $("<li>", {class: "list-group-item"});

                    // conversation image
                    if(typeof arr[con]["imageSrc"] !== undefined && arr[con]["imageSrc"] !== null && arr[con]["imageSrc"] !== ""){
                        var conversationImage = $("<img>", {class: "img-circle media-object pull-left", width: "32", height: "32", src: arr[con]["imageSrc"]});
                        //console.log(arr[con]["imageSrc"]);
                        conversation.append(conversationImage);
                    }else{
                        var user = api.getUserInfo([arr[con]["participantIDs"][0]], function(err, ret){
                            if(err) return console.error(err);

                            if(typeof ret["thumbSrc"] !== undefined && ret["thumbSrc"] !== null){
                                var conversationImage = $("<img>", {class: "img-circle media-object pull-left", width: "32", height: "32", src: ret["thumbSrc"]});
                            }else{
                                var conversationImage = $("<img>", {class: "img-circle media-object pull-left", width: "32", height: "32", src: "http://bractwo-kurkowe.pl/gfx/img/12112911574581.jpg"});
                            }
                            conversation.append(conversationImage);
                        });
                    }

                    // conversation name
                    if(typeof arr[con]["name"] !== undefined && arr[con]["name"] !== null && arr[con]["name"] !== ""){
                        var conversationBody = $("<div>", {class: "media-body", html: "<strong>" + arr[con]["name"] + "</strong>"});
                        conversation.append(conversationBody);
                    }else{
                        var user = api.getUserInfo([arr[con]["participantIDs"][0]], function(err, ret){
                            if(err) return console.error(err);

                            for(var prop in ret) {
                                if(ret.hasOwnProperty(prop)){
                                    var conversationBody = $("<div>", {class: "media-body", html: "<strong>" + ret[prop].firstName + ret[prop].lastName "</strong>"});
                                    conversation.append(conversationBody);
                                }
                            }
                        });
                    }

                    $("#conversations").append(conversation);
                    //console.log("tryin to load conversations 3")
                }
            }
        });
    });
}