Phoenix.factory 'history', [
  '$rootScope'
  ($root) ->
    limit = 10
    history = (localStorage.getItem 'history').split(',') or []
    $root.colorHistory = history.slice(0).reverse()
    $root.apply()
    push: (color) ->
      history.push color
      $root.colorHistory = history.slice(0).reverse().filter (_, i) -> i < limit + 1
      localStorage.setItem 'history', history
      $root.apply()
]
