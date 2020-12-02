share = {};

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
TAPi18n.Collection = function(name, options) {
  // Set the transform option
  if (options == null) { options = {}; }
  if (Meteor.isClient) {
    const original_transform = options.transform || (doc => doc);
    options.transform = doc => share.i18nCollectionTransform(original_transform(doc), collection);
  }

  var collection = share.i18nCollectionExtensions(commonCollectionExtensions(new Meteor.Collection(name, options)));

  if (Meteor.isClient) {
    if (Package["yogiben:admin"] != null) {
      collection._disableTransformationOnRoute(/^\/admin(\/?$|\/)/);
    }
  }

  collection._base_language = "base_language" in options ? options["base_language"] : globals.fallback_language;

  return collection;
};

share.helpers = {};
share.helpers.dialectOf = function(lang) {
  if ((lang != null) && Array.from(lang).includes("-")) {
    return lang.replace(/-.*/, "");
  }
  return null;
};

share.helpers.removeTrailingUndefs = function(arr) {
  while ((!_.isEmpty(arr)) && (_.isUndefined(_.last(arr)))) {
    arr.pop();
  }
  return arr;
};

const {
  removeTrailingUndefs
} = share.helpers;

var commonCollectionExtensions = function(obj) {
  const reportError = function(error, attempted_operation, callback) {
    if (_.isFunction(callback)) {
      Meteor.setTimeout((() => callback(error, false)), 0);
    } else {
      console.log(`${attempted_operation} failed: ${error.reason}`);
    }

    return error;
  };

  const throwError = function(error, attempted_operation, callback) {
    throw reportError(error, attempted_operation, callback);
  };

  const verifyI18nEnabled = function(attempted_operation, callback) {
    if (TAPi18n._enabled()) {
      return;
    }

    return throwError(new Meteor.Error(400, "TAPi18n is not supported"), attempted_operation, callback);
  };

  const isSupportedLanguage = function(lang, attempted_operation, callback) {
    if (Array.from(TAPi18n.conf.supported_languages).includes(lang)) {
      return;
    }

    return throwError(new Meteor.Error(400, `Not supported language: ${lang}`), attempted_operation, callback);
  };

  const getLanguageOrEnvLanguage = function(language_tag, attempted_operation, callback) {
    // if no language_tag & isClient, try to get env lang
    if (Meteor.isClient) {
      if ((language_tag == null)) {
        language_tag = TAPi18n.getLanguage();
      }
    }

    if (language_tag != null) {
      return language_tag;
    }

    return throwError(new Meteor.Error(400, "Missing language_tag"), attempted_operation, callback);
  };

  obj.insertTranslations = function(doc, translations, callback) {
    try {
      verifyI18nEnabled("insert", callback);
    } catch (error) {
      return null;
    }

    doc = _.extend({}, doc);
    translations = _.extend({}, translations);

    if (translations != null) {
      for (let lang in translations) {
        // make sure all languages in translations are supported
        try {
          isSupportedLanguage(lang, "insert", callback);
        } catch (error1) {
          return null;
        }

        // merge base language's fields with regular fields
        if (lang === this._base_language) {
          doc = _.extend(doc, translations[lang]);

          delete translations[lang];
        }
      }

      if (!_.isEmpty(translations)) {
        doc = _.extend(doc, {i18n: translations});
      }
    }

    return this.insert.apply(this, removeTrailingUndefs([doc, callback]));
  };

  obj.updateTranslations = function(selector, translations, options, callback) {
    if (_.isFunction(options)) {
      callback = options;
      options = undefined;
    }

    try {
      verifyI18nEnabled("update", callback);
    } catch (error) {
      return null;
    }

    const updates = {};

    if (translations != null) {
      for (var lang in translations) {
        // make sure all languages in translations are supported
        try {
          isSupportedLanguage(lang, "update", callback);
        } catch (error1) {
          return null;
        }

        // treat base language's fields as regular fields
        if (lang === this._base_language) {
          _.extend(updates, translations[lang]);
        } else {
          _.extend(updates, _.object(_.map(translations[lang], ((val, field) => [`i18n.${lang}.${field}`, val]))));
        }
      }
    }

    return this.update.apply(this, removeTrailingUndefs([selector, {$set: updates}, options, callback]));
  };

  obj.removeTranslations = function(selector, fields, options, callback) {
    if (_.isFunction(options)) {
      callback = options;
      options = undefined;
    }

    try {
      verifyI18nEnabled("remove translations", callback);
    } catch (error) {
      return null;
    }

    if ((fields == null)) {
      reportError(new Meteor.Error(400, "Missing arugment: fields"), "remove translations", callback);
      return null;
    }

    if (!_.isArray(fields)) {
      reportError(new Meteor.Error(400, "fields argument should be an array"), "remove translations", callback);
      return null;
    }

    const updates = {};

    for (let field of Array.from(fields)) {
      const lang = _.first(field.split("."));

      // make sure all languages are supported
      try {
        isSupportedLanguage(lang, "remove translations", callback);
      } catch (error1) {
        return null;
      }

      // treat base language's fields as regular fields
      if (lang === this._base_language) {
        field = field.replace(`${lang}.`, "");
        if (field === this._base_language) {
          reportError(new Meteor.Error(400, "Complete removal of collection's base language from a document is not permitted"), "remove translations", callback);
          return null;
        }

        updates[field] = "";
      } else {
        updates[`i18n.${field}`] = "";
      }
    }

    return this.update.apply(this, removeTrailingUndefs([selector, {$unset: updates}, options, callback]));
  };

  obj.insertLanguage = function(doc, translations, language_tag, callback) {
    try {
      verifyI18nEnabled("insert", callback);
    } catch (error) {
      return null;
    }

    // in case language_tag omitted
    if (_.isFunction(language_tag)) {
      callback = language_tag;
      language_tag = undefined;
    }

    try {
      language_tag = getLanguageOrEnvLanguage(language_tag, "insert", callback);
    } catch (error1) {
      return null;
    }

    const _translations = {};
    _translations[language_tag] = translations;

    return this.insertTranslations(doc, _translations, callback);
  };

  obj.updateLanguage = function(selector, translations) {
    let callback, options;
    try {
      verifyI18nEnabled("update", callback);
    } catch (error) {
      return null;
    }

    let language_tag = (options = (callback = undefined));

    const args = _.toArray(arguments);
    for (let arg of Array.from(args.slice(2))) {
      if (_.isFunction(arg)) {
        callback = arg;
        break;
      } else if (_.isObject(arg)) {
        options = arg;
      } else if (_.isUndefined(options) && _.isString(arg)) {
        // language_tag can't come after options
        language_tag = arg;
      }
    }

    try {
      language_tag = getLanguageOrEnvLanguage(language_tag, "update", callback);
    } catch (error1) {
      return null;
    }

    const _translations = {};
    _translations[language_tag] = translations;

    return this.updateTranslations(selector, _translations, options, callback);
  };

  // Alias
  obj.translate = obj.updateLanguage;

  obj.removeLanguage = function(selector, fields) {
    let _fields_to_remove, callback, options;
    try {
      verifyI18nEnabled("remove translations", callback);
    } catch (error) {
      return null;
    }

    let language_tag = (options = (callback = undefined));

    const args = _.toArray(arguments);
    for (let arg of Array.from(args.slice(2))) {
      if (_.isFunction(arg)) {
        callback = arg;
        break;
      } else if (_.isObject(arg)) {
        options = arg;
      } else if (_.isUndefined(options) && _.isString(arg)) {
        // language_tag can't come after options
        language_tag = arg;
      }
    }

    try {
      language_tag = getLanguageOrEnvLanguage(language_tag, "remove", callback);
    } catch (error1) {
      return null;
    }

    if ((fields !== null) && !_.isArray(fields)) {
      reportError(new Meteor.Error(400, "fields argument should be an array"), "remove translations", callback);
      return null;
    }

    if (fields === null) {
      // remove entire language
      _fields_to_remove = [`${language_tag}`];
    } else {
      _fields_to_remove = _.map(fields, field => `${language_tag}.${field}`);
    }

    return this.removeTranslations(selector, _fields_to_remove, options, callback);
  };

  return obj;
};
