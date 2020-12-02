/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const test_collections = (share.test_collections = {
  a: new TAPi18n.Collection("a"), // ids in a collection will only be those that % 3 = 0
  b: new TAPi18n.Collection("b"), // ids in a collection will only be those that % 3 = 1
  c: new TAPi18n.Collection("c"), // ids in a collection will only be those that % 3 = 2

  a_aa: new TAPi18n.Collection("a_aa", {base_language: "aa"}),
  b_aa: new TAPi18n.Collection("b_aa", {base_language: "aa"}),
  c_aa: new TAPi18n.Collection("c_aa", {base_language: "aa"})
});

test_collections["a_aa-AA"] = new TAPi18n.Collection("a_aa-AA", {base_language: "aa-AA"});
test_collections["b_aa-AA"] = new TAPi18n.Collection("b_aa-AA", {base_language: "aa-AA"});
test_collections["c_aa-AA"] = new TAPi18n.Collection("c_aa-AA", {base_language: "aa-AA"});

const translations_editing_tests_collection = new TAPi18n.Collection("trans_editing");

translations_editing_tests_collection.allow({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

if (Meteor.isServer) {
  Meteor.publish("trans_editing", () => translations_editing_tests_collection.find({}));
} else {
  Meteor.subscribe("trans_editing");
}

share.translations_editing_tests_collection = translations_editing_tests_collection;

for (let col in test_collections) {
  test_collections[col].allow({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
  });
}


const collection_classes_map = {
  a: 0,
  b: 1,
  c: 2
};

const languages = (share.supported_languages = ["en", "aa", "aa-AA"]);
const max_document_id = (share.max_document_id = 30);

if (Meteor.isClient) {
  window.test_collections = test_collections;
  window.translations_editing_tests_collection = translations_editing_tests_collection;
}

const init_collections = function() {
  // clear all test collections
  let collection;
  for (collection in test_collections) {
    test_collections[collection].remove({});
  }

  const properties_to_translate = ["not_translated_to_en", "not_translated_to_aa", "not_translated_to_aa-AA"];
  return __range__(0, max_document_id, false).map((i) =>
    (() => {
      const result = [];
      for (let collection_name in test_collections) {
        var language_tag;
        collection = test_collections[collection_name];
        const base_language = collection_name.replace(/(.*_|.*)/, "") || "en";
        const collection_class = collection_name.replace(/_.*/, "");

        if ((i % 3) !== collection_classes_map[collection_class]) {
          continue;
        }

        const doc = {_id: `${share.lpad(i, 4)}`, id: i, i18n: {}};

        // init languages subdocuments
        for (language_tag of Array.from(languages)) {
          if (language_tag !== base_language) {
            doc.i18n[language_tag] = {};
          }
        }

        for (language_tag of Array.from(languages)) {
          for (let property of Array.from(properties_to_translate)) {
            const not_translated_to = property.replace("not_translated_to_", "");
            const value = `${property}-${language_tag}-${i}`;
            if (language_tag !== not_translated_to) {
              var set_on;
              if (language_tag === base_language) {
                set_on = doc;
              } else {
                set_on = doc.i18n[language_tag];
              }

              set_on[property] = value;
            }
          }
        }

        result.push(collection.insert(doc));
      }
      return result;
    })());
};

// Server inits
if (Meteor.isServer) {
  // init collections
  init_collections();

  for (let _class of ["a", "b", "c"]) {
    ((_class => TAPi18n.publish(`class_${_class}`, function(fields=null) {
      // connect to the 3 types of class
      let cursors = [];

      if ((fields == null)) {
        cursors = cursors.concat(test_collections[`${_class}`].i18nFind());
        cursors = cursors.concat(test_collections[`${_class}_aa`].i18nFind());
        cursors = cursors.concat(test_collections[`${_class}_aa-AA`].i18nFind());
      } else {
        cursors = cursors.concat(test_collections[`${_class}`].i18nFind({}, {fields}));
        cursors = cursors.concat(test_collections[`${_class}_aa`].i18nFind({}, {fields}));
        cursors = cursors.concat(test_collections[`${_class}_aa-AA`].i18nFind({}, {fields}));
      }

      return cursors;
    })))(_class);
  }
}

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}