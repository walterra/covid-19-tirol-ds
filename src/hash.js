'use strict';

const HASH_NAMES = true;

module.exports = function(s){
  if (!HASH_NAMES) {
    return s.replace(',', ';');
  }
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
};
