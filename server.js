(function() {
  var Settings, app, express, path, settings, templates, _;
  express = require('express');
  path = require('path');
  _ = require('underscore');
  Settings = require('settings');
  templates = {};
  settings = new Settings(path.join(__dirname, 'config/environment.js')).getEnvironment();
  app = express.createServer();
  app.configure(function() {
    app.use(express.errorHandler(settings.errorHandling));
    app.use(express.static(settings.publicDir, {
      maxAge: settings.staticMaxAge
    }));
    app.use(express.bodyParser());
    app.use(express.cookieParser({
      maxAge: settings.cookieMaxAge
    }));
    return app.use(express.session({
      secret: settings.cookieSecret
    }));
  });
  app.get('/', function(req, res) {
    return res.send(templates['index']({
      name: 'World'
    }));
  });
  app.listen(process.env.PORT || 8001);
}).call(this);
