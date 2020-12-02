/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
share.lpad = function(value, padding) {
  let zeroes = "0";
  for (let i = 1, end = padding, asc = 1 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) { zeroes += "0"; }
  return (zeroes + value).slice(padding * -1);
};

share.once = cb => (function() {
  if ((cb.once == null)) {
    cb.once = true;
    return cb();
  }
});

share.dialectOf = function(lang) {
  if ((lang != null) && Array.from(lang).includes("-")) {
    return lang.replace(/-.*/, "");
  }
  return null;
};

share.now = () => new Date().getTime();
