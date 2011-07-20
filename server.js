(function() {
  var Settings, app, compileTemplate, express, fs, indexFilePath, path, settings, templates, _;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  express = require('express');
  path = require('path');
  _ = require('underscore');
  Settings = require('settings');
  templates = {};
  settings = new Settings(path.join(__dirname, 'config/environment.js')).getEnvironment();
  fs = require('fs');
  indexFilePath = 'templates/index.html';
  compileTemplate = function(file) {
    var templateName;
    templateName = path.basename(file, path.extname(file));
    return fs.readFile(file, 'utf8', __bind(function(err, data) {
      var compiled;
      if (err) {
        return console.log(err);
      }
      compiled = _.template(data);
      return templates[templateName] = compiled;
    }, this));
  };
  compileTemplate(indexFilePath);
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
