messenger = require 'facebook-chat-api'
Phoenix.factory 'login', [
  '$rootScope'
  '$timeout'
  ($scope, $timeout) ->
    ->
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
                          color: $scope.predefinedColors[0]
                        data.color = info.color or $scope.predefinedColors[0] unless err?
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
                        color: $scope.predefinedColors[0]
                      data.color = info.color or $scope.predefinedColors[0] unless err?
                      $scope.contacts.push data
                      $scope.apply()

            $scope.login_info = 'Ok :D'
            $scope.apply()

            $timeout ->
              $scope.api = api
              $scope.apply()
            , 500
]