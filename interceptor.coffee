fs = require 'fs'
path = require 'path'
stylus = require 'stylus'
pug = require 'pug'
mime = require 'mime'
coffee = require 'coffee-script'

app.on 'ready', ->
  protocol = electron.protocol
  protocol.interceptBufferProtocol 'file', (req, next) ->
    parsed = require 'url'
      .parse req.url
    file = parsed.pathname
    file = file.substr 1 if process.platform == 'win32' and !parsed.host.trim()
    try
      content = fs.readFileSync file
      ext = path.extname file
      switch ext
        when '.coffee'
          str = ''
          try
            str = coffee.compile content.toString()
            str = str.replace '(function() {', ''
            str = str.split '\n'
            str.shift()
            str.pop()
            str.pop()
            str = str.join '\n'
          catch err
            console.error err.message+' at '+(1+err.location.first_line)+' in '+file
            str = '/*'+err.code+'*/ throw new SyntaxError("'+err.message+'", "'+file+'", '+(1+err.location.first_line)+');'
          next
            data: new Buffer str
            mimeType: 'text/plain'
        when '.styl'
          stylus content.toString()
            .include require('nib').path
            .import 'nib'
            .render (err, css) ->
              if err
                console.error err
              next
                data: new Buffer css
                mimeType: 'text/css'
        when '.jade'
          compiled = pug.compileFile(file, {})({})
          next
            data: new Buffer compiled
            mimeType: 'text/html'
        when '.pug'
          compiled = pug.compileFile(file, {})({})
          next
            data: new Buffer compiled
            mimeType: 'text/html'
        else
          next
            data: content
            mimeType: mime.lookup ext
    catch e
      console.log e
      return next 6 if e.code == 'ENOENT'
      next 2
  , (err, scheme) ->
    console.error 'Interceptor failed:', err if err
