/**
 * Created by artur9010 on 19.07.2016.
 */

const waff = require("waff-query")
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
                //console.log(arr[prot]);
                var conversationName;
                var conversationImage;
                var conversatonID;
                if(arr[prot]["isCanonicalUser"]){ //is user
                    console.log([arr[prot]["participantIDs"][0]]);
                    api.getUserInfo([arr[prot]["participantIDs"][0]], function(err, res){
                        if(err) return console.error(err);
                        console.log(res);
                        for(var prop in res) {
                            //console.log(res[prop].name);
                            conversationName = res[prop].name;
                            conversationImage = res[prop].thumbSrc;
                            conversatonID = [arr[prot]["participantIDs"][0]];
                        }
                    });
                }else{ //is group
                    conversationName = arr[prot]["name"];
                    conversationImage = arr[prot]["imageSrc"];
                    conversatonID = arr[prot]["threadID"];
                }

                var conversationDOM = waff.e("li.list-group-item.conversation");
                var conversationDOMimage = waff.e("img.img-circle.media-object.pull-left");
                conversationDOMimage.attr("width", 32);
                conversationDOMimage.attr("height", 32);
                conversationDOMimage.attr("src", conversationImage);
                var conversationDOMname = waff.e(".media-body");
                conversationDOMname.html("<strong>" + conversationName + "</strong>");
                conversationDOM.append(conversationDOMimage);
                conversationDOM.append(conversationDOMname);
                waff.q("#conversations").append(conversationDOM);
            }
        });

        /*waff.qq(".conversation").on("click", function(e){
            waff.qq(".conversation").removeClass("active");
            waff.q(this).addClass("active");
            //todo: do something
        })*/
    })
}