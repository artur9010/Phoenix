Phoenix.directive 'changeButton', [
  '$rootScope'
  'notify'
  'history'
  ($root, $notify, history) ->
    restrict: 'C'
    link: ($scope, $el) ->
      change = $el[0]
      change.on 'click', () ->
        id = $scope.active.id

        $root.api.changeThreadColor $root.picker.getHexString(), id, (err) ->
          if err?
            $notify 'Error changing color...'
            return console.error err
          debug && console.log id
          debug && console.log $root.thread id
          color = $root.picker.getHexString()
          $root.thread(id).color = color
          history.push color
          $root.apply()
          $notify 'Color changed successfully :D'
]
