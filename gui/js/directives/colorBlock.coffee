Phoenix.directive 'colorBlock', [
  '$rootScope'
  'history'
  ($root) ->
    restrict: 'C'
    link: ($scope, $el) ->
      color = $el[0]
      color.on 'click', () ->
        if $root.active
          color = @css('background')
          $root.thread($root.active.id).newColor = color
          $root.picker.setColor color
          q('.color-block.randoooom').css background: color
          $root.apply()
]
