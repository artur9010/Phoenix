# node.js imports
waff = require('waff-query/dist/waff-query.js')
messenger = require('facebook-chat-api')
ColorPicker = require('simple-color-picker')

# Angular
Phoenix = angular.module 'phoenix', [ ]

Phoenix.run [
  '$rootScope'
  '$timeout'
  ($scope, $timeout) ->
    $scope.api = false
    $scope.submitted = false
    $scope.login_info = ' '
    $scope.contacts = []

    fb_color = '#0084ff'

    $scope.apply = (p) ->
      t = @$root.$$phase
      if '$apply' is t or '$digest' is t
        p and 'function' is typeof p and p()
      else
        @$apply p

    $scope.thread = (id) ->
      for thread in $scope.contacts
        return thread if thread.id == id

    $scope.login = ->
      $scope.submitted = true
      $scope.apply ->
        $scope.login_info = 'Logging in...'
        messenger
          email: waff.q('.username').value
          password: waff.q('.password').value
          (err, api) ->
            if err?
              $scope.submitted = false
              $scope.login_info = err.error
              $scope.apply()
              return console.error err

            $scope.login_info = 'Loading thread list...'
            $scope.apply()

            api.getThreadList 0, 50, (err, threads) ->
              if err
                $scope.submitted = false
                $scope.login_info = err.error
                $scope.apply()
                return console.error err

              userids = []

              for id, thread of threads
                if thread.readOnly is false
                  if thread.isCanonicalUser is true
                    userids.push thread.threadID
                  else
                    do(thread) ->
                      api.getThreadInfo thread.threadID, (err, info) ->
                        data =
                          name: thread.name
                          image: thread.imageSrc or 'img/default.jpg'
                          id: thread.threadID
                          color: fb_color
                        data.color = info.color or fb_color unless err?
                        $scope.contacts.push data
                        $scope.apply()

              api.getUserInfo userids, (err, users) ->
                return console.error err if err?
                for id, user of users
                  do (id, user) ->
                    api.getThreadInfo id, (err, info) ->
                      data =
                        name: user.name
                        image: user.thumbSrc or 'img/default.jpg'
                        id: id
                        color: fb_color
                      data.color = info.color or fb_color unless err?
                      $scope.contacts.push data
                      $scope.apply()

              $scope.login_info = 'Ok :D'
              $scope.apply()

              $timeout ->
                $scope.api = api
                $scope.apply()
              , 500
]

Phoenix.directive 'form', [
  '$rootScope'
  ($root) ->
    restrict: 'E'
    link: ($scope, $el, $attr) ->
      form = $el[0]
      form.on 'submit', (e) ->
        e.preventDefault()
        $root.login() if $root.submitted == false
]

Phoenix.directive 'colorpicker', [
  '$rootScope'
  ($root) ->
    restrict: 'C'
    link: ($scope, $el, $attr) ->
      picker = $el[0]
      $root.picker = window.picker = new ColorPicker
        color: '#ff0000'
        el: picker
        height: 150
        width: 150 + 25
        background: '#ffffff'

      $root.picker.onChange ->
        if $root.active
          $root.thread($root.active.id).newColor = $root.picker.getHexString()
          $root.apply()
]

Phoenix.directive 'colorBlock', [
  '$rootScope'
  ($root) ->
    restrict: 'C'
    link: ($scope, $el, $attr) ->
      color = $el[0]
      color.on 'click', (e) ->
        if $root.active
          $root.thread($root.active.id).newColor = @css('background')
          $root.picker.setColor @css('background')
          $root.apply()
]

Phoenix.directive 'changeButton', [
  '$rootScope'
  'notify'
  ($root, $notify) ->
    restrict: 'C'
    link: ($scope, $el, $attr) ->
      change = $el[0]
      change.on 'click', (e) ->
        id = $scope.active.id

        $root.api.changeThreadColor $root.picker.getHexString(), id, (err) ->
          if err?
            $notify 'Error changing color...'
            return console.error err
          $root.thread(@id).color = $root.picker.getHexString()
          $root.apply()
          $notify 'Color changed successfully :D'
]

Phoenix.directive 'conversation', [
  '$rootScope'
  ($root) ->
    restrict: 'C'
    link: ($scope, $el, $attr) ->
      conversation = $el[0]
      conversation.on 'click', (e) ->
        $root.thread($root.active.id).newColor = null if $root.active
        $root.active = @
        $root.apply()
        process.nextTick ->
          $root.picker.setColor conversation.q('.color').css 'background'
          $root.apply()
]

Phoenix.factory 'notify', ->
  (body) ->
    new Notification 'Phoenix', body: body
