Phoenix.factory 'notify', ->
  (body) ->
    new Notification 'Phoenix', body: body
