# node.js imports
waff = require 'waff-query/dist/waff-query.js'
glob = require 'glob'
path = require 'path'

require 'coffee-script/register'
global.debug = !~process.argv.indexOf('--debug')

# Angular
global.Phoenix = angular.module 'phoenix', [ ]

# Require directives and factories
for directive in glob.sync __dirname + '/js/directives/*.coffee'
  debug && console.log directive
  require path.resolve directive
for factory in glob.sync __dirname + '/js/factories/*.coffee'
  debug && console.log factory
  require path.resolve factory

Phoenix.run [
  '$rootScope'
  '$timeout'
  ($scope) ->
    $scope.api = false
    $scope.submitted = false
    $scope.login_info = ' '
    $scope.contacts = []
    $scope.predefinedColors = [
      '#0084FF'
      '#44BEC7'
      '#FFC300'
      '#FA3C4C'
      '#D696BB'
      '#6699CC'
      '#13CF13'
      '#FF7E29'
      '#E68585'
      '#7646FF'
      '#20CEF5'
      '#67B868'
      '#D4A88C'
      '#FF5CA1'
      '#A695C7'
    ]

    $scope.apply = (p) ->
      t = @$root.$$phase
      if '$apply' is t or '$digest' is t
        p and 'function' is typeof p and p()
      else
        @$apply p

    $scope.thread = (id) ->
      for thread in $scope.contacts
        return thread if thread.id == id
]

