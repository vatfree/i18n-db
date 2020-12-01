Package.describe({
  name: 'vatfree:i18n-db',
  summary: 'Internationalization for Meteor Collections',
  version: '1.0.0',
  git: 'https://github.com/vatfree/tap-i18n-db'
});

Package.on_use(function (api) {
  api.versionsFrom('1.6');

  api.use(["coffeescript", "underscore", "meteor", "jquery", "reactive-dict"], ['server', 'client']);

  api.use("autopublish", ['server', 'client'], {weak: true})

  api.use('vatfree:i18n@1.31.0', ['client', 'server']);
  api.imply('vatfree:i18n', ['client', 'server']);

  api.use('yogiben:admin@1.1.0', {weak: true});

  api.add_files('globals.js', ['client', 'server']);
  api.add_files('tap_i18n_db-common.coffee', ['client', 'server']);
  api.add_files('tap_i18n_db-server.coffee', 'server');
  api.add_files('tap_i18n_db-client.coffee', 'client');
});
