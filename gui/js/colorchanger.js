/**
 * Created by artur9010 on 19.07.2016.
 */

const waff = require("waff-query");
const messenger = require("facebook-chat-api");

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function login_to_messenger() {
    messenger({
        email: getParameterByName("username"),
        password: getParameterByName("password")
    }, function callback(err, api) {
        if (err) {
            return console.error(err);
        }

        /*api.getUserInfo([100012621480066], function(err, ret) {
            if(err) return console.error(err);

            for(var prop in ret) {
                if(ret.hasOwnProperty(prop)) {
                    console.log(ret[prop])
                }
            }
        });*/

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
                (function(){
                    //console.log(arr[prot]);
                    var conversationName;
                    var conversationImage;
                    var conversatonID;
                    if(arr[prot]["isCanonicalUser"]){ //is user
                        //console.log([arr[prot]["participantIDs"][0]].toString());
                        api.getUserInfo([arr[prot]["participantIDs"][0]], function(err, res){
                            if(err) return console.error(err);
                            for(var prop in res) {
                                conversationName = res[prop].name;
                                console.log(conversationName);
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
            var conversationDOM = waff.e("li.list-group-item.conversation");
            var conversationDOMimage = waff.e("img.img-circle.media-object.pull-left");
            conversationDOMimage.attr("width", 32);
            conversationDOMimage.attr("height", 32);
            conversationDOMimage.attr("src", image);
            var conversationDOMname = waff.e(".media-body");
            conversationDOMname.html("<strong>" + name + "</strong>");
            conversationDOM.append(conversationDOMimage);
            conversationDOM.append(conversationDOMname);
            waff.q("#conversations").append(conversationDOM);
        }

        waff.qq(".conversation").forEach(function(el){
            this.on("click", function(e){
                qq('.conversation.active').forEach((e)=>e.classList.remove('active'));
                this.classList.add('active');
            })
        })
    })
}