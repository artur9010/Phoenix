Phoenix.directive 'conversation', [
  '$rootScope'
  ($root) ->
    restrict: 'C'
    link: ($scope, $el) ->
      conversation = $el[0]
      conversation.on 'click', () ->
        $root.thread($root.active.id).newColor = null if $root.active
        $root.active = @
        $root.apply()
        process.nextTick ->
          $root.picker.setColor conversation.q('.color').css 'background'
          $root.apply()
]
