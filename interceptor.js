// Part of https://gist.github.com/wvffle/97f683ee1d0c7114120a7375538f0378
var fs, mime, path, stylus;

fs = require('fs');

path = require('path');

stylus = require('stylus');

mime = require('mime');

app.on('ready', function() {
  var protocol;
  protocol = electron.protocol;
  return protocol.interceptBufferProtocol('file', function(req, next) {
    var compiled, content, e, err, ext, file, parsed, str;
    parsed = require('url').parse(req.url);
    file = parsed.pathname;
    if (process.platform === 'win32' && !parsed.host.trim()) {
      file = file.substr(1);
    }
    try {
      content = fs.readFileSync(file);
      ext = path.extname(file);
      switch (ext) {
        case '.styl':
          return stylus(content.toString()).include(require('nib').path)["import"]('nib').render(function(err, css) {
            if (err) {
              console.error(err);
            }
            return next({
              data: new Buffer(css),
              mimeType: 'text/css'
            });
          });
        default:
          return next({
            data: content,
            mimeType: mime.lookup(ext)
          });
      }
    } catch (_error) {
      e = _error;
      console.log(e);
      if (e.code === 'ENOENT') {
        return next(6);
      }
      return next(2);
    }
  }, function(err, scheme) {
    if (err) {
      return console.error('Interceptor failed:', err);
    }
  });
});
