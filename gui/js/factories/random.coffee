Phoenix.factory 'random', ->
  () ->
    "hsl(#{~~(Math.random() * 360)}, 60%, 60%)"
