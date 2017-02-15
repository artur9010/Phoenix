Phoenix.directive 'randoooom', [
  '$rootScope'
  'random'
  ($root, random) ->
    restrict: 'C'
    link: ($scope, $el) ->
      element = $el[0]
      element.on ['mouseover', 'click'], ->
        if $root.active
          color = random()
          process.nextTick ->
            $root.thread($root.active.id).newColor = color
            $root.picker.setColor color
            element.css background: color
]
