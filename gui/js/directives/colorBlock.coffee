Phoenix.directive 'colorBlock', [
  '$rootScope'
  ($root) ->
    restrict: 'C'
    link: ($scope, $el) ->
      color = $el[0]
      color.on 'click', () ->
        if $root.active
          $root.thread($root.active.id).newColor = @css('background')
          $root.picker.setColor @css('background')
          $root.apply()
]
