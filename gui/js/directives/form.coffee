Phoenix.directive 'form', [
  '$rootScope'
  'login'
  ($root, login) ->
    restrict: 'E'
    link: ($scope, $el) ->
      form = $el[0]
      form.on 'submit', (e) ->
        e.preventDefault()
        login() if $root.submitted == false
]
