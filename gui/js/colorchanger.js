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

/*function login_to_messenger(){
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
 var conversation = $("<li>", {class: "list-group-item conversation"});

 // conversation image
 if(typeof arr[con]["imageSrc"] !== undefined && arr[con]["imageSrc"] !== null && arr[con]["imageSrc"] !== ""){
 var conversationImage = $("<img>", {class: "img-circle media-object pull-left", width: "32", height: "32", src: arr[con]["imageSrc"]});
 //console.log(arr[con]["imageSrc"]);
 conversation.append(conversationImage);
 }else{
 var user = api.getUserInfo([arr[con]["participantIDs"][0]], function(err, ret){
 if(err) return console.error(err);

 for(var prop in ret) {
 if (ret.hasOwnProperty(prop)) {
 if(typeof ret["thumbSrc"] !== undefined && ret["thumbSrc"] !== null){
 var conversationImage = $("<img>", {class: "img-circle media-object pull-left", width: "32", height: "32", src: ret[prop].thumbSrc});
 }else{
 var conversationImage = $("<img>", {class: "img-circle media-object pull-left", width: "32", height: "32", src: "http://bractwo-kurkowe.pl/gfx/img/12112911574581.jpg"});
 }
 conversation.append(conversationImage);
 }
 }
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
 var conversationBody = $("<div>", {class: "media-body", html: "<strong>" + ret[prop].name + "</strong>"});
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
 }*/

function login_to_messenger() {
    messenger({
        email: getParameterByName("username"),
        password: getParameterByName("password")
    }, function callback(err, api) {
        if (err) {
            return console.error(err);
        }

        api.getUserInfo([100012621480066], function(err, ret) {
            if(err) return console.error(err);

            for(var prop in ret) {
                if(ret.hasOwnProperty(prop)) {
                    console.log(ret[prop])
                }
            }
        });

        api.getThreadList(0, 50, function (err, arr) {
            /*
            conversations:
            - image: imageSrc
            - name: name

            users:
            - image: thumbSrc
            - name: name
             */
            if(err){
                return console.error(err);
            }
            for(prot in arr){
                //console.log(arr[prot]);
                if(arr[prot]["canReply"]){ //dont display conversations where user cant reply
                    var conversationName;
                    var conversationImage;
                    var conversatonID;
                    if(arr[prot]["isCanonical"]){ //is user
                        conversationName = "user";
                        conversationImage = "http://d2.christiantoday.com/en/full/21113/zoe-saldana-as-neytiri-in-avatar.jpg";
                    }else{ //is group
                        conversationName = "group";
                        conversationImage = "http://d2.christiantoday.com/en/full/21113/zoe-saldana-as-neytiri-in-avatar.jpg";
                    }
                    var conversationDOM = $("</li>", {class: "list-group-item"});
                    conversationDOM.append($("<img>", {class: "img-circle media-object pull-left", width: 32, height: 32, src: conversationImage}));
                    conversationDOM.append($("<div>", {class: "media-body", html: "<strong>" + conversationName + "</strong>"}));
                    $("#conversations").append(conversationDOM);

                }
                // - sprawdz czy jest grupa czy userem x
                // -- jezeli user to zrob dla usera x
                // -- jezeli grupa to zrob dla grupy x
                // - stworz piekny element x
            }
        });

        $(".conversation").click(function () {

        });
    })
}