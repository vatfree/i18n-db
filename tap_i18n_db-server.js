/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Fiber = Npm.require('fibers');

share.i18nCollectionExtensions = function(obj) {
  obj.i18nFind = function(selector, options) {
    let lang;
    const current_language = Fiber.current.language_tag;

    if (typeof current_language === "undefined") {
      throw new Meteor.Error(500, "TAPi18n.i18nFind should be called only from TAPi18n.publish functions");
    }

    if (_.isUndefined(selector)) {
      selector = {};
    }

    const dialect_of = share.helpers.dialectOf(current_language);
    const collection_base_language = this._base_language;

    const {
      supported_languages
    } = TAPi18n.conf;
    if ((current_language != null) && !(Array.from(supported_languages).includes(current_language))) {
      throw new Meteor.Error(400, "Not supported language");
    }

    if ((options == null)) {
      options = {};
    }
    const original_fields = options.fields || {};
    const i18n_fields = _.extend({}, original_fields);

    if (!_.isEmpty(i18n_fields)) {
      // determine the projection kind
      // note that we don't need to address the case where {_id: 0}, since _id: 0
      // is not allowed for cursors returned from a publish function
      let field;
      delete i18n_fields._id;
      const white_list_projection = _.first(_.values(i18n_fields)) === 1;
      if ("_id" in original_fields) {
        i18n_fields["_id"] = original_fields["_id"];
      }

      if (white_list_projection) {
        if (lang !== null) {
          for (lang of Array.from(supported_languages)) {
            if ((lang !== collection_base_language) && ((lang === current_language) || (lang === dialect_of))) {
              for (field in original_fields) {
                if ((field !== "_id") && !(Array.from(field).includes("."))) {
                  i18n_fields[`i18n.${lang}.${field}`] = 1;
                }
              }
            }
          }
        }
      } else {
        // black list
        if (current_language === null) {
          i18n_fields.i18n = 0;
        } else {
          for (lang of Array.from(supported_languages)) {
            if (lang !== collection_base_language) {
              if ((lang !== current_language) && (lang !== dialect_of)) {
                i18n_fields[`i18n.${lang}`] = 0;
              } else {
                for (field in original_fields) {
                  if ((field !== "_id") && !(Array.from(field).includes("."))) {
                    i18n_fields[`i18n.${lang}.${field}`] = 0;
                  }
                }
              }
            }
          }
        }
      }
    } else {
      if (current_language === null) {
        i18n_fields.i18n = 0;
      } else {
        for (lang of Array.from(supported_languages)) {
          if ((lang !== collection_base_language) && (lang !== current_language) && (lang !== dialect_of)) {
            i18n_fields[`i18n.${lang}`] = 0;
          }
        }
      }
    }

    return this.find(selector, _.extend({}, options, {fields: i18n_fields}));
  };

  return obj;
};

TAPi18n.publish = function(name, handler, options) {
  if (name === null) {
    throw new Meteor.Error(500, "TAPi18n.publish doesn't support null publications");
  }

  const i18n_handler = function() {
    const args = Array.prototype.slice.call(arguments);

    // last subscription argument is always the language tag
    const language_tag = _.last(args);
    this.language = language_tag;
    // Set handler context in current fiber's
    Fiber.current.language_tag = language_tag;
    // Call the user handler without the language_tag argument
    const cursors = handler.apply(this, args.slice(0, -1));
    // Clear handler context
    delete Fiber.current.language_tag;

    if (cursors != null) {
      return cursors;
    }
  };

  // set the actual publish method
  return Meteor.publish(name, i18n_handler, options);
};
