ColorPicker = require 'simple-color-picker'
Phoenix.directive 'colorpicker', [
  '$rootScope'
  ($root) ->
    restrict: 'C'
    link: ($scope, $el) ->
      picker = $el[0]
      $root.picker = window.picker = new ColorPicker
        color: $root.predefinedColors[0]
        el: picker
        height: 150
        width: 150 + 25
        background: '#ffffff'

      $root.picker.onChange ->
        if $root.active
          $root.thread($root.active.id).newColor = $root.picker.getHexString()
          $root.apply()
]
