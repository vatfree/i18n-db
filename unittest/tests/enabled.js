/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  test_collections
} = share;
const {
  translations_editing_tests_collection
} = share;
const idle_time = 2000;
const {
  once
} = share;



Tinytest.add('vatfree-i18n-db - translations editing - insertTranslations - valid test', function(test) {
  let _id;
  return test.equal(
    translations_editing_tests_collection.findOne((_id = translations_editing_tests_collection.insertTranslations({a: 1, b: 5}, {aa: {c: 3}, en: {b: 2, d: 4}})), {transform: null}),
    {a: 1, b: 2, d: 4, i18n: {aa: {c: 3}}, _id});
});

Tinytest.add('vatfree-i18n-db - translations editing - insertTranslations - no translations', function(test) {
  let _id;
  return test.equal(
    translations_editing_tests_collection.findOne((_id = translations_editing_tests_collection.insertTranslations({a: 1, b: 2})), {transform: null}),
    {a: 1, b: 2, _id});
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - insertTranslations - unsupported lang', function(test, onComplete) {
  let result;
  return result = translations_editing_tests_collection.insertTranslations({a: 1, b: 2}, {ru: {c: 3}},
             function(err, id) {
               test.isFalse(id);
               test.instanceOf(err, Meteor.Error);
               test.equal(err.reason, "Not supported language: ru");
               test.isNull(result);

               return onComplete();
  });
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - insertLanguage - language: collection\'s base language', (test, onComplete) => translations_editing_tests_collection.insertLanguage({a: 1, b: 5}, {b: 2, d: 4}, "en",
  function(err, id) {
    test.equal(
      translations_editing_tests_collection.findOne(id, {transform: null}),
      {a: 1, b: 2, d: 4, _id: id});
    return onComplete();
}));

Tinytest.add('vatfree-i18n-db - translations editing - insertLanguage - language: not collection\'s base language', function(test) {
  let _id;
  return test.equal(
    translations_editing_tests_collection.findOne((_id = translations_editing_tests_collection.insertLanguage({a: 1, b: 5}, {b: 2, d: 4}, "aa")), {transform: null}),
    {a: 1, b: 5, i18n: {aa: {b: 2, d: 4}}, _id});
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - insertLanguage - language: not supported language', function(test, onComplete) {
  let result;
  return result = translations_editing_tests_collection.insertLanguage({a: 1, b: 5}, {b: 2, d: 4}, "ru",
             function(err, id) {
               test.isFalse(id);
               test.instanceOf(err, Meteor.Error);
               test.equal(err.reason, "Not supported language: ru");
               test.isNull(result);

               return onComplete();
  });
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - insertLanguage - language: not specified', function(test, onComplete) {
  let result;
  return result = translations_editing_tests_collection.insertLanguage({a: 1, b: 5}, {b: 2, d: 4},
             function(err, id) {
               test.isFalse(id);
               test.instanceOf(err, Meteor.Error);
               test.equal(err.reason, "Missing language_tag");
               test.isNull(result);

               return onComplete();
  });
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - updateTranslations - valid update', function(test, onComplete) {
  const _id = translations_editing_tests_collection.insertTranslations({a: 5, b: 6}, {aa: {x: 4, y: 5}, "aa-AA": {l: 1, m: 2}});
  let result = translations_editing_tests_collection.updateTranslations(_id, {en: {a: 1}, aa: {x: 1}});
  result = translations_editing_tests_collection.updateTranslations(_id, {en: {b: 2, c: 3}, aa: {y: 2, z: 3}, "aa-AA": {n: 3}});
  test.equal(result, 1, "Correct number of affected documents");
  test.equal(
    translations_editing_tests_collection.findOne(_id, {transform: null}),
    {a: 1, b: 2, c: 3, i18n: {aa: {x: 1, y: 2, z: 3}, "aa-AA": {l: 1, m: 2, n: 3}}, _id});
  return onComplete();
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - updateTranslations - empty update', function(test, onComplete) {
  const _id = translations_editing_tests_collection.insertTranslations({a: 1}, {aa: {x: 1}});
  const result = translations_editing_tests_collection.updateTranslations(_id);
  test.equal(
    translations_editing_tests_collection.findOne(_id, {transform: null}),
    {a: 1, i18n: {aa: {x: 1}}, _id});
  test.equal(result, 1, "Correct number of affected documents");
  return onComplete();
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - updateTranslations - unsupported lang', function(test, onComplete) {
  let result;
  const _id = translations_editing_tests_collection.insertTranslations({a: 1}, {aa: {x: 1}});
  return result = translations_editing_tests_collection.updateTranslations(_id, {ru: {c: 3}},
             function(err, id) {
               test.isFalse(id);
               test.instanceOf(err, Meteor.Error);
               test.equal(err.reason, "Not supported language: ru");
               test.isNull(result);

               return onComplete();
  });
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - translate - valid update', function(test, onComplete) {
  const _id = translations_editing_tests_collection.insertTranslations({a: 5, b: 2}, {aa: {x: 4, y: 2}});
  let result = translations_editing_tests_collection.translate(_id, {a: 1, c: 3}, "en");
  test.equal(result, 1, "Correct number of affected documents");
  result = translations_editing_tests_collection.translate(_id, {x: 1, z: 3}, "aa", {});
  test.equal(result, 1, "Correct number of affected documents");
  return result = translations_editing_tests_collection.translate(_id, {l: 1, m: 2, n: 3}, "aa-AA", {}, (err, affected_rows) => Meteor.setTimeout((function() {
    test.equal(1, affected_rows);
    test.equal(
      translations_editing_tests_collection.findOne(_id, {transform: null}),
      {a: 1, b: 2, c: 3, i18n: {aa: {x: 1, y: 2, z: 3}, "aa-AA": {l: 1, m: 2, n: 3}}, _id});
    return onComplete();
  }), 1000));
});

Tinytest.add('vatfree-i18n-db - translations editing - remove translation - valid remove', function(test) {
  const _id = translations_editing_tests_collection.insertTranslations({a: 1, b: 2}, {aa: {x: 1, y: 2}, "aa-AA": {l: 1, m: 2}});
  let result = translations_editing_tests_collection.removeTranslations(_id, ["en.a", "aa.y", "aa-AA"]); // remove some fields and the entire AA-aa lang
  test.equal(result, 1, "Correct number of affected documents");
  result = translations_editing_tests_collection.removeTranslations(_id, [], {}); // remove nothing
  test.equal(result, 1, "Correct number of affected documents");
  return test.equal(
    translations_editing_tests_collection.findOne(_id, {transform: null}),
    {b: 2, i18n: {aa: {x: 1}}, _id});
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - remove translation - attempt to remove base language', function(test, onComplete) {
  let result;
  const _id = translations_editing_tests_collection.insertTranslations({a: 1, b: 2}, {aa: {x: 1, y: 2}, "aa-AA": {l: 1, m: 2}});
  return result = translations_editing_tests_collection.removeTranslations(_id, ["en"],
             function(err, affected_rows) {
               test.isFalse(affected_rows);
               test.instanceOf(err, Meteor.Error);
               test.equal(err.reason, "Complete removal of collection's base language from a document is not permitted");
               test.isNull(result);

               return onComplete();
  });
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - remove translation - fields argument is not an array', function(test, onComplete) {
  let result;
  const _id = translations_editing_tests_collection.insertTranslations({a: 1, b: 2}, {aa: {x: 1, y: 2}, "aa-AA": {l: 1, m: 2}});
  return result = translations_editing_tests_collection.removeTranslations(_id, {},
             function(err, affected_rows) {
               test.isFalse(affected_rows);
               test.instanceOf(err, Meteor.Error);
               test.isNull(result);

               return onComplete();
  });
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - remove language - valid remove', function(test, onComplete) {
  const _id = translations_editing_tests_collection.insertTranslations({a: 1, b: 2, c: 3}, {aa: {x: 1, y: 2}, "aa-AA": {l: 1, m: 2}});
  let result = translations_editing_tests_collection.removeLanguage(_id, ["a", "c"], "en"); // remove some fields - base lang
  test.equal(result, 1, "Correct number of affected documents");
  result = translations_editing_tests_collection.removeLanguage(_id, ["x"], "aa", {}, (err, affected_rows) => // remove some fields - general lang
  test.equal(affected_rows, 1, "Correct number of affected documents"));
  result = translations_editing_tests_collection.removeLanguage(_id, [], "aa"); // remove nothing - general lang
  test.equal(result, 1, "Correct number of affected documents");
  return result = translations_editing_tests_collection.removeLanguage(_id, null, "aa-AA", (err, affected_rows) => // remove entire language
  Meteor.setTimeout(function() {
    test.equal(affected_rows, 1, "Correct number of affected documents");

    test.equal(
      translations_editing_tests_collection.findOne(_id, {transform: null}),
      {b: 2, i18n: {aa: {y: 2}}, _id});

    return onComplete();
  }));
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - remove language - attempt to remove base language', function(test, onComplete) {
  const _id = translations_editing_tests_collection.insertTranslations({a: 1, b: 2, c: 3}, {aa: {x: 1, y: 2}, "aa-AA": {l: 1, m: 2}});
  return translations_editing_tests_collection.removeLanguage(_id, null, "en", (err, affected_rows) => Meteor.setTimeout((function() {
    test.isFalse(affected_rows);
    test.instanceOf(err, Meteor.Error);
    test.equal(err.reason, "Complete removal of collection's base language from a document is not permitted");

    return onComplete();
  })
  ));
});

Tinytest.addAsync('vatfree-i18n-db - translations editing - remove language - fields argument is not an array', function(test, onComplete) {
  let result;
  const _id = translations_editing_tests_collection.insertTranslations({a: 1, b: 2}, {aa: {x: 1, y: 2}, "aa-AA": {l: 1, m: 2}});
  return result = translations_editing_tests_collection.removeLanguage(_id, {}, "aa",
             function(err, affected_rows) {
               test.isFalse(affected_rows);
               test.instanceOf(err, Meteor.Error);
               test.isNull(result);

               return onComplete();
  });
});

if (Meteor.isServer) {
  Tinytest.add('vatfree-i18n-db - TAPi18n.i18nFind works only from TAPi18n.publish', test => test.throws((() => test_collections.a.i18nFind()), "TAPi18n.i18nFind should be called only from TAPi18n.publish functions"));
}

if (Meteor.isClient) {
  let subscription_b, subscription_c;
  document.title = "UnitTest: vatfree-i18n-db used in a vatfree-i18n enabled project";

  const supported_languages = _.keys(TAPi18n.getLanguages());

  const {
    max_document_id
  } = share;

  const get_general_classed_collections = function(class_suffix) {
    if (class_suffix == null) { class_suffix = ""; }
    const remap_results = results => // remap the results object so the keys will be value of the result's key field
    _.reduce(_.values(results), function(a, b) { a[b.id] = b; return a; }, {});

    const collections_docs = [
      remap_results(test_collections[`a${class_suffix}`].find({}, {sort: {"id": 1}}).fetch()),
      remap_results(test_collections[`b${class_suffix}`].find({}, {sort: {"id": 1}}).fetch()),
      remap_results(test_collections[`c${class_suffix}`].find({}, {sort: {"id": 1}}).fetch())
    ];

    const docs = [];

    for (let i = 0, end = max_document_id, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      if (i in collections_docs[i % 3]) {
        if (collections_docs[i % 3][i] != null) {
          docs.push(collections_docs[i % 3][i]);
        }
      }
    }

    return docs;
  };

  const get_basic_collections_docs = () => get_general_classed_collections();

  const get_regular_base_language_collections_docs = () => get_general_classed_collections("_aa");

  const get_dialect_base_language_collections_docs = () => get_general_classed_collections("_aa-AA");

  const get_all_docs = function() {
    const basic = get_basic_collections_docs();
    const regular_lang = get_regular_base_language_collections_docs();
    const dialect = get_dialect_base_language_collections_docs();
    const all = [].concat(basic, regular_lang, dialect);

    return {basic, regular_lang, dialect, all};
  };

  let subscription_a = (subscription_b = (subscription_c = null));

  const stop_all_subscriptions = function() {
    for (let i of [subscription_a,  subscription_b,  subscription_c]) {
      if (i != null) {
        i.stop();
      }
    }
    return Deps.flush(); // force the cleanup of the minimongo collections
  };

  const subscribe_simple_subscriptions = function() {
    stop_all_subscriptions();

    const a_dfd = new $.Deferred();
    subscription_a = TAPi18n.subscribe("class_a", {onReady() { return a_dfd.resolve(); }, onError(error) { return a_dfd.reject(); }});
    const b_dfd = new $.Deferred();
    subscription_b = TAPi18n.subscribe("class_b", {onReady() { return b_dfd.resolve(); }, onError(error) { return b_dfd.reject(); }});
    const c_dfd = new $.Deferred();
    subscription_c = TAPi18n.subscribe("class_c", {onReady() { return c_dfd.resolve(); }, onError(error) { return c_dfd.reject(); }});

    return [[subscription_a, subscription_b, subscription_c], [a_dfd, b_dfd, c_dfd]];
  };

  const subscribe_complex_subscriptions = function() {
    stop_all_subscriptions();

    const language_to_exclude_from_class_a_and_b =
      supported_languages[(supported_languages.indexOf(TAPi18n.getLanguage()) + 1) % supported_languages.length];

    // class_a - inclusive projection - all properties but language_to_exclude_from_class_a_and_b
    const a_dfd = new $.Deferred();
    let projection = {_id: 1, id: 1};

    for (let language of Array.from(supported_languages)) {
      if (language !== language_to_exclude_from_class_a_and_b) {
        projection[`not_translated_to_${language}`] = 1;
      }
    }

    subscription_a = TAPi18n.subscribe("class_a", projection, {onReady() { return a_dfd.resolve(); }, onError(error) { return a_dfd.reject(); }});

    const b_dfd = new $.Deferred();
    projection = {_id: 1}; // _id: 1, just to make a bit more complex, should behave just the same
    projection[`not_translated_to_${language_to_exclude_from_class_a_and_b}`] = 0;
    subscription_b = TAPi18n.subscribe("class_b", projection, {onReady() { return b_dfd.resolve(); }, onError(error) { return b_dfd.reject(); }});

    const c_dfd = new $.Deferred();
    projection = {_id: 1}; // _id: 1, just to make a bit more complex, should behave just the same
    projection[`not_translated_to_${TAPi18n.getLanguage()}`] = 0;
    subscription_c = TAPi18n.subscribe("class_c", projection, {onReady() { return c_dfd.resolve(); }, onError(error) { return c_dfd.reject(); }});

    return [[subscription_a, subscription_b, subscription_c], [a_dfd, b_dfd, c_dfd]];
  };

  const validate_simple_subscriptions_documents = function(test, subscriptions, documents) {
    const current_language = TAPi18n.getLanguage();
    const i18n_supported = (current_language != null);

    const base_language_by_collection_type = {
      basic: test_collections.a._base_language,
      regular_lang: test_collections.a_aa._base_language,
      dialect: test_collections["a_aa-AA"]._base_language
    };

    return (() => {
      const result = [];
      for (let collection_type in base_language_by_collection_type) {
        var collection_base_language = base_language_by_collection_type[collection_type];

        const collection_type_documents = documents[collection_type];

        result.push(_.each(collection_type_documents, doc => (() => {
          const result1 = [];
          for (let language_property_not_translated_to of Array.from(supported_languages)) {
            var expected_value;
            let should_translate_to = current_language;
            if (should_translate_to === null) {
              should_translate_to = collection_base_language;
            }
            const should_translate_to_dialect_of = share.dialectOf(should_translate_to);

            const property = `not_translated_to_${language_property_not_translated_to}`;
            const value = doc[property];

            if (should_translate_to !== language_property_not_translated_to) {
              expected_value = `${property}-${should_translate_to}-${doc.id}`;
            } else {
              if (i18n_supported) {
                if (should_translate_to_dialect_of != null) {
                  expected_value = `${property}-${should_translate_to_dialect_of}-${doc.id}`;
                } else if (collection_base_language !== should_translate_to) {
                  expected_value = `${property}-${collection_base_language}-${doc.id}`;
                } else {
                  expected_value = undefined;
                }
              } else {
                expected_value = undefined;
              }
            }

            result1.push(test.equal(expected_value, value));
          }
          return result1;
        })()));
      }
      return result;
    })();
  };

  const validate_complex_subscriptions_documents = function(test, subscriptions, documents) {
    const current_language = TAPi18n.getLanguage();
    const i18n_supported = (current_language != null);

    const base_language_by_collection_type = {
      basic: test_collections.a._base_language
      //regular_lang: test_collections.a_aa._base_language
      //dialect: test_collections["a_aa-AA"]._base_language
    };

    return (() => {
      const result = [];
      for (var collection_type in base_language_by_collection_type) {
        var collection_base_language = base_language_by_collection_type[collection_type];
        const collection_type_documents = documents[collection_type];

        result.push(_.each(collection_type_documents, function(doc) {
          const language_excluded_from_class_a_and_b =
            supported_languages[(supported_languages.indexOf(current_language) + 1) % supported_languages.length];
          let field_excluded_from_doc = null;
          switch (doc.id % 3) {
            case 0: field_excluded_from_doc = language_excluded_from_class_a_and_b; break;
            case 1: field_excluded_from_doc = language_excluded_from_class_a_and_b; break;
            case 2: field_excluded_from_doc = current_language; break;
          }

          return (() => {
            const result1 = [];
            for (let language_property_not_translated_to of Array.from(supported_languages)) {
              var expected_value;
              let should_translate_to = current_language;
              if (should_translate_to === null) {
                should_translate_to = collection_base_language;
              }
              const should_translate_to_dialect_of = share.dialectOf(should_translate_to);

              const property = `not_translated_to_${language_property_not_translated_to}`;
              const value = doc[property];

              if (language_property_not_translated_to === field_excluded_from_doc) {
                expected_value = undefined;
              } else if (should_translate_to !== language_property_not_translated_to) {
                expected_value = `${property}-${should_translate_to}-${doc.id}`;
              } else {
                if (i18n_supported) {
                  if (should_translate_to_dialect_of != null) {
                    expected_value = `${property}-${should_translate_to_dialect_of}-${doc.id}`;
                  } else if (collection_base_language !== should_translate_to) {
                    expected_value = `${property}-${collection_base_language}-${doc.id}`;
                  } else {
                    expected_value = undefined;
                  }
                } else {
                  expected_value = undefined;
                }
              }

              result1.push(test.equal(expected_value, value, `col_type=${collection_type}, property=${property}`));
            }
            return result1;
          })();
        }));
      }
      return result;
    })();
  };

  const general_tests = function(test, subscriptions, documents) {
    test.equal(documents.all.length, max_document_id * 3, "Expected documents count in collections");

    return test.isTrue((_.reduce((_.map(documents.all, doc => doc.i18n == null)), ((memo, current) => memo && current), true)), "The subdocument i18n is not part of the documents");
  };

  const null_language_tests = function(test, subscriptions, documents) {
  };

  Tinytest.addAsync('vatfree-i18n-db - language: null; simple pub/sub - general tests', function(test, onComplete) {
    const subscriptions = subscribe_simple_subscriptions();

    const test_case = once(function() {
      const documents = get_all_docs();

      general_tests(test, subscriptions, documents);

      null_language_tests(test, subscriptions, documents);

      validate_simple_subscriptions_documents(test, subscriptions, documents);

      return onComplete();
    });

    return Deps.autorun(function() {
      if (subscription_a.ready() && subscription_b.ready() && subscription_c.ready()) {
        return test_case();
      }
    });
  });

  if ((Package.autopublish == null)) {
    Tinytest.addAsync('vatfree-i18n-db - language: null; complex pub/sub - general tests', function(test, onComplete) {
      const subscriptions = subscribe_complex_subscriptions();

      const test_case = once(function() {
        const documents = get_all_docs();

        general_tests(test, subscriptions, documents);

        null_language_tests(test, subscriptions, documents);

        validate_complex_subscriptions_documents(test, subscriptions, documents);

        return onComplete();
      });

      return Deps.autorun(function() {
        if (subscription_a.ready() && subscription_b.ready() && subscription_c.ready()) {
          return test_case();
        }
      });
    });
  }

  Tinytest.addAsync('vatfree-i18n-db - language: en; simple pub/sub - general tests', (test, onComplete) => TAPi18n.setLanguage("en")
    .done(function() {
      const subscriptions = subscribe_simple_subscriptions();

      return $.when.apply(this, subscriptions[1])
        .done(function() {
          const documents = get_all_docs();

          general_tests(test, subscriptions, documents);

          validate_simple_subscriptions_documents(test, subscriptions, documents);

          return onComplete();
      });
  }));

  if ((Package.autopublish == null)) {
    Tinytest.addAsync('vatfree-i18n-db - language: en; complex pub/sub - general tests', (test, onComplete) => TAPi18n.setLanguage("en")
      .done(function() {
        const subscriptions = subscribe_complex_subscriptions();

        return $.when.apply(this, subscriptions[1])
          .done(function() {
            const documents = get_all_docs();

            general_tests(test, subscriptions, documents);

            validate_complex_subscriptions_documents(test, subscriptions, documents);

            return onComplete();
        });
    }));
  }

  Tinytest.addAsync('vatfree-i18n-db - language: aa; simple pub/sub - general tests', (test, onComplete) => TAPi18n.setLanguage("aa")
    .done(function() {
      const subscriptions = subscribe_simple_subscriptions();

      return $.when.apply(this, subscriptions[1])
        .done(function() {
          const documents = get_all_docs();

          general_tests(test, subscriptions, documents);

          validate_simple_subscriptions_documents(test, subscriptions, documents);

          return onComplete();
      });
  }));

  if ((Package.autopublish == null)) {
    Tinytest.addAsync('vatfree-i18n-db - language: aa; complex pub/sub - general tests', (test, onComplete) => TAPi18n.setLanguage("aa")
      .done(function() {
        const subscriptions = subscribe_complex_subscriptions();

        return $.when.apply(this, subscriptions[1])
          .done(function() {
            const documents = get_all_docs();

            general_tests(test, subscriptions, documents);

            validate_complex_subscriptions_documents(test, subscriptions, documents);

            return onComplete();
        });
    }));
  }

  Tinytest.addAsync('vatfree-i18n-db - language: aa-AA; simple pub/sub - general tests', (test, onComplete) => TAPi18n.setLanguage("aa-AA")
    .done(function() {
      const subscriptions = subscribe_simple_subscriptions();

      return $.when.apply(this, subscriptions[1])
        .done(function() {
          const documents = get_all_docs();

          general_tests(test, subscriptions, documents);

          validate_simple_subscriptions_documents(test, subscriptions, documents);

          return onComplete();
      });
  }));

  if ((Package.autopublish == null)) {
    Tinytest.addAsync('vatfree-i18n-db - language: aa-AA; complex pub/sub - general tests', (test, onComplete) => TAPi18n.setLanguage("aa-AA")
      .done(function() {
        const subscriptions = subscribe_complex_subscriptions();

        return $.when.apply(this, subscriptions[1])
          .done(function() {
            const documents = get_all_docs();

            general_tests(test, subscriptions, documents);

            validate_complex_subscriptions_documents(test, subscriptions, documents);

            return onComplete();
        });
    }));
  }

  Tinytest.addAsync('vatfree-i18n-db - subscribing with a not-supported language fails', function(test, onComplete) {
    const dfd = new $.Deferred();
    Meteor.subscribe("class_a", "gg-GG", {
      onReady() {
        return dfd.reject();
      },
      onError(e) {
        test.equal(400, e.error);
        test.equal("Not supported language", e.reason);
        return dfd.resolve(e);
      }
    }
    );

    return dfd
      .fail(() => test.fail("Subscriptions that should have failed succeeded")).always(() => onComplete());
  });

  Tinytest.addAsync('vatfree-i18n-db - reactivity test - simple subscription', function(test, onComplete) {
    let interval_handle;
    TAPi18n.setLanguage(supported_languages[0]);

    const subscriptions = subscribe_simple_subscriptions();

    let last_invalidation = null;
    let documents = null;
    const comp = Deps.autorun(function() {
      documents = get_all_docs();

      return last_invalidation = share.now();
    });

    return interval_handle = Meteor.setInterval((function() {
      if ((last_invalidation + idle_time) < share.now()) {
        // comp is idle

        console.log(`Testing simple subscriptions' reactivity: language=${TAPi18n.getLanguage()}`);

        // test
        general_tests(test, subscriptions, documents);

        validate_simple_subscriptions_documents(test, subscriptions, documents);

        const lang_id = supported_languages.indexOf(TAPi18n.getLanguage());
        if ((lang_id + 1) < supported_languages.length) {
          // switch language
          return TAPi18n.setLanguage(supported_languages[lang_id + 1]);
        } else {
          // stop
          comp.stop();

          Meteor.clearInterval(interval_handle);

          return onComplete();
        }
      }
    }), idle_time);
  });

  if ((Package.autopublish == null)) {
    Tinytest.addAsync('vatfree-i18n-db - reactivity test - complex subscription', function(test, onComplete) {
      let interval_handle;
      stop_all_subscriptions();
      TAPi18n.setLanguage(supported_languages[0]);

      const fields_to_exclude = ["not_translated_to_en", "not_translated_to_aa", "not_translated_to_aa-AA"];

      const local_session = new ReactiveDict();
      local_session.set("field_to_exclude", fields_to_exclude[0]);

      local_session.set("projection_type", 0);

      let fields = null;
      let subscriptions = null;
      Deps.autorun(function() {
        const field_to_exclude = local_session.get("field_to_exclude");
        fields = {};
        if (local_session.get("projection_type") === 0) {
          fields[field_to_exclude] = 0;
        } else {
          for (let field of Array.from(fields_to_exclude)) {
            if (field !== field_to_exclude) {
              fields[field] = 1;
            }
          }
          fields["id"] = 1;
        }

        const a_dfd = new $.Deferred();
        subscription_a = TAPi18n.subscribe("class_a", fields, {onReady() { return a_dfd.resolve(); }, onError(error) { return a_dfd.reject(); }});
        const b_dfd = new $.Deferred();
        subscription_b = TAPi18n.subscribe("class_b", fields, {onReady() { return b_dfd.resolve(); }, onError(error) { return b_dfd.reject(); }});
        const c_dfd = new $.Deferred();
        subscription_c = TAPi18n.subscribe("class_c", fields, {onReady() { return c_dfd.resolve(); }, onError(error) { return c_dfd.reject(); }});

        return subscriptions = [[subscription_a, subscription_b, subscription_c], [a_dfd, b_dfd, c_dfd]];});

      let last_invalidation = null;
      let documents = null;
      const comp = Deps.autorun(function() {
        documents = get_all_docs();

        return last_invalidation = share.now();
      });

      return interval_handle = Meteor.setInterval((function() {
        let lang_id, projection_id;
        if ((last_invalidation + idle_time) < share.now()) {
          // comp is idle

          console.log(`Testing complex subscriptions' reactivity: language=${TAPi18n.getLanguage()}; field_to_exclude=${local_session.get("field_to_exclude")}; projection_type=${local_session.get("projection_type") ? "inclusive" : "exclusive"}; projection=${EJSON.stringify(fields)}`);
        }

         // test
        general_tests(test, subscriptions, documents);

        documents.all.forEach(doc => test.isUndefined(doc[local_session.get("field_to_exclude")]));

        if (local_session.get("projection_type") === 0) {
           return local_session.set("projection_type", 1);
         } else if ((local_session.get("projection_type") === 1) &&
              (((projection_id = fields_to_exclude.indexOf(local_session.get("field_to_exclude"))) + 1) < fields_to_exclude.length)) {
           local_session.set("projection_type", 0);
           return local_session.set("field_to_exclude", fields_to_exclude[projection_id + 1]);
         } else if (((lang_id = supported_languages.indexOf(TAPi18n.getLanguage())) + 1) < supported_languages.length) {
           // switch language
           TAPi18n.setLanguage(supported_languages[lang_id + 1]);
           local_session.set("projection_type", 0);
           return local_session.set("field_to_exclude", fields_to_exclude[0]);
         } else {
           // stop
           comp.stop();

           Meteor.clearInterval(interval_handle);

           return onComplete();
         }
     }), idle_time);
    });
  }
}

// Translations editing tests that require env language != null
if (Meteor.isClient) {
  Tinytest.addAsync('vatfree-i18n-db - translations editing - insertLanguage - language_tag=TAPi18n.getLanguage()', (test, onComplete) => TAPi18n.setLanguage("aa")
    .done(function() {
      let _id;
      return test.equal(
        translations_editing_tests_collection.findOne((_id = translations_editing_tests_collection.insertLanguage({a: 1, b: 5}, {b: 2, d: 4}, (() => onComplete()))), {transform: null}, {transform: null}),
        {a: 1, b: 5, i18n: {aa: {b: 2, d: 4}}, _id});}));

  Tinytest.addAsync('vatfree-i18n-db - translations editing - translate - language_tag=TAPi18n.getLanguage()', (test, onComplete) => TAPi18n.setLanguage("aa")
    .done(function() {
      const _id = translations_editing_tests_collection.insertTranslations({a: 5, b: 2}, {aa: {x: 4, y: 2}});
      let result = translations_editing_tests_collection.translate(_id, {a: 1, c: 3});
      test.equal(result, 1, "Correct number of affected documents");
      result = translations_editing_tests_collection.translate(_id, {x: 1, z: 3}, {});
      test.equal(result, 1, "Correct number of affected documents");
      return result = translations_editing_tests_collection.translate(_id, {l: 1, m: 2}, (err, affected_rows) => Meteor.setTimeout((function() {
        test.equal(1, affected_rows);
        test.equal(
          translations_editing_tests_collection.findOne(_id, {transform: null}),
          {a: 5, b: 2, i18n: {aa: {a: 1, c: 3, x: 1, y: 2, z: 3, l: 1, m: 2}}, _id});
        return onComplete();
      }), 1000));
  }));

  Tinytest.addAsync('vatfree-i18n-db - translations editing - removeLanguage - language_tag=TAPi18n.getLanguage()', (test, onComplete) => TAPi18n.setLanguage("aa")
    .done(function() {
      const _id = translations_editing_tests_collection.insertTranslations({a: 5, b: 2}, {aa: {u: 1, v: 2, w: 3, x: 4, y: 2, z: 1}});
      let result = translations_editing_tests_collection.removeLanguage(_id, ["x", "y"]);
      test.equal(result, 1, "Correct number of affected documents");
      result = translations_editing_tests_collection.removeLanguage(_id, ["y", "z"], {});
      test.equal(result, 1, "Correct number of affected documents");
      return result = translations_editing_tests_collection.removeLanguage(_id, ["u", "v"], (err, affected_rows) => Meteor.setTimeout((function() {
        test.equal(1, affected_rows);
        test.equal(
          translations_editing_tests_collection.findOne(_id, {transform: null}),
          {a: 5, b: 2, i18n: {aa: {w: 3}}, _id});
        return onComplete();
      }), 1000));
  }));

  Tinytest.addAsync('vatfree-i18n-db - translations editing - removeLanguage - complete remove - language_tag=TAPi18n.getLanguage()', (test, onComplete) => TAPi18n.setLanguage("aa")
    .done(function() {
      let result;
      const _id = translations_editing_tests_collection.insertTranslations({a: 5, b: 2}, {aa: {u: 1, v: 2, w: 3, x: 4, y: 2, z: 1}});
      return result = translations_editing_tests_collection.removeLanguage(_id, null, (err, affected_rows) => Meteor.setTimeout((function() {
        test.equal(1, affected_rows);
        test.equal(
          translations_editing_tests_collection.findOne(_id, {transform: null}),
          {a: 5, b: 2, i18n: {}, _id});
        return onComplete();
      }), 1000));
  }));

  Tinytest.addAsync('vatfree-i18n-db - translations editing - removeLanguage - attempt complete remove base language - language_tag=TAPi18n.getLanguage()', (test, onComplete) => TAPi18n.setLanguage("en")
    .done(function() {
      let result;
      const _id = translations_editing_tests_collection.insertTranslations({a: 5, b: 2}, {aa: {u: 1, v: 2, w: 3, x: 4, y: 2, z: 1}});
      return result = translations_editing_tests_collection.removeLanguage(_id, null, (err, affected_rows) => Meteor.setTimeout((function() {
        test.isFalse(affected_rows);
        test.instanceOf(err, Meteor.Error);
        test.equal(err.reason, "Complete removal of collection's base language from a document is not permitted");
        return onComplete();
      }), 1000));
  }));
}
