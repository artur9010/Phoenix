/**
 * Created by artur9010 on 19.07.2016.
 */

//node.js imports
const waff = require("waff-query/dist/waff-query.js");
const messenger = require("facebook-chat-api");
const ColorPicker = require("simple-color-picker");

//Angular

Phoenix = angular.module('phoenix', []);

Phoenix.run([
  '$rootScope',
  function($scope){
    $scope.api = false;
    $scope.submitted = false;
    $scope.login_info = ' ';
    $scope.contacts = [];

    $scope.safeApply=function(p){var t=this.$root.$$phase;"$apply"==t||"$digest"==t?p&&"function"==typeof p&&p():this.$apply(p)};

    $scope.thread = function(id) {
      for (var i = 0; i < $scope.contacts.length; i++) {
        var thread = $scope.contacts[i];
        if(thread.id == id) return thread;
      }
    }

    $scope.login = function(){
      $scope.submitted = true;
      $scope.safeApply(function () {
        $scope.login_info = 'Logging in...';
        messenger({
          email: waff.q(".username").value,
          password: waff.q(".password").value
        }, function callback(err, api) {
          if (err) {
            $scope.submitted = false;
            $scope.login_info = err.error;
            $scope.safeApply();
            return console.error(err);
          }
          $scope.login_info = 'Loading thread list...';
          $scope.safeApply();
          api.getThreadList(0, 50, function(err, threads){
            if (err) {
              $scope.submitted = false;
              $scope.login_info = err.error;
              $scope.safeApply();
              return console.error(err);
            }
            var userids = [];
            for (let id in threads){
              let thread = threads[id];
              if(thread.readOnly === false){
                if(thread.isCanonicalUser === true){
                  // is user
                  userids.push(thread.threadID);
                } else {
                  // is group
                  api.getThreadInfo(thread.threadID, function(err, info){
                    var data = {
                      name: thread.name,
                      image: thread.imageSrc || 'img/default.jpg',
                      id: thread.threadID,
                      color: '#0084ff'
                    };
                    if(!err){
                      data.color = info.color || '#0084ff';
                    }
                    $scope.contacts.push(data);
                    $scope.safeApply();
                  })
                }
              }
            }
            api.getUserInfo(userids, function (err, users){
              if (err) return console.error(err);
              for (let id in users) {
                let user = users[id];
                api.getThreadInfo(id, function(err, info){
                  var data = {
                    name: user.name,
                    image: user.thumbSrc || 'img/default.jpg',
                    id: id,
                    color: '#0084ff'
                  };
                  if(!err){
                    data.color = info.color || '#0084ff';
                  }
                  $scope.contacts.push(data);
                  $scope.safeApply();
                })
              }
            })
            $scope.login_info = 'Ok :D';
            $scope.safeApply();
            setTimeout(function(){
                $scope.api = api;
                $scope.safeApply();
            }, 500);
          });
        });
      });
    }
  }
]);

Phoenix.directive('form', [
  '$rootScope',
  function($root){
    return {
      restrict: 'E',
      link: function($scope, $el, $attr){
        var form = $el[0];
        form.on("submit", function (e) {
            e.preventDefault();
            if($root.submitted === false) $root.login();
        });
      }
    }
  }
]);

Phoenix.directive('colorpicker', [
  '$rootScope',
  function($root){
    return {
      restrict: 'C',
      link: function($scope, $el, $attr){
        var picker = $el[0];
        $root.picker = window.picker = new ColorPicker({
            color: '#FF0000',
            el: picker,
            height: 150,
            width: 150 + 25,
            background: '#FFFFFF'
        });
        $root.picker.onChange(function () {
          if($root.active){
            $root.thread($root.active.id).newColor = $root.picker.getHexString()

            $root.safeApply()
          }
        })
      }
    }
  }
]);

Phoenix.directive('colorBlock', [
  '$rootScope',
  function($root){
    return {
      restrict: 'C',
      link: function($scope, $el, $attr){
        var color = $el[0];
        color.on("click", function (e) {
          if($root.active){
            $root.thread($root.active.id).newColor = this.css("background");
            $root.picker.setColor(this.css("background"));
          }
          $root.safeApply()
        });
      }
    }
  }
]);

Phoenix.directive('changeButton', [
  '$rootScope',
  function($root){
    return {
      restrict: 'C',
      link: function($scope, $el, $attr){
        var change = $el[0];
        change.on("click", function (e) {
          id = $scope.active.id
          $root.api.changeThreadColor($root.picker.getHexString(), id, function callback(err) {
            if (err){
              sendNotification("Error changing color...");
              return console.error(err);
            }
            $root.thread(this.id).color = $root.picker.getHexString();
            $root.safeApply()
            sendNotification("Color changed successfully :D");
          });
        });
      }
    }
  }
]);

Phoenix.directive('conversation', [
  '$rootScope',
  function($root){
    return {
      restrict: 'C',
      link: function($scope, $el, $attr){
        var conversation = $el[0];

        conversation.on("click", function (e) {
          if($root.active){
            $root.thread($root.active.id).newColor = null;
          }
          $root.active = this;
          $root.safeApply()
          process.nextTick(function(){
            $root.picker.setColor(conversation.q('.color').css("background"));
            $root.safeApply()
          })
        });
      }
    }
  }
]);

//Utils
function sendNotification(body) {
    new Notification("Phoenix", {body: body})
}
