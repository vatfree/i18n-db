Package.describe({
  name: 'vatfree:i18n-db',
  summary: 'Internationalization for Meteor Collections',
  version: '1.0.0',
  git: 'https://github.com/vatfree/i18n-db'
});

Package.on_use(function (api) {
  api.versionsFrom('1.6');

  api.use(["coffeescript", "underscore", "meteor", "jquery", "reactive-dict"], ['server', 'client']);

  api.use('vatfree:i18n@1.8.1', ['client', 'server']);
  api.imply('vatfree:i18n', ['client', 'server']);

  api.add_files('globals.js', ['client', 'server']);
  api.add_files('tap_i18n_db-common.js', ['client', 'server']);
  api.add_files('tap_i18n_db-server.js', 'server');
  api.add_files('tap_i18n_db-client.js', 'client');
});

