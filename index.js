
/*!
 * Deps.
 */

var fs = require('fs');

/**
 * Expose `envcfg` as the module.
 */

module.exports = exports = envcfg;

/**
 * Create a config into an environment aware one.
 *
 * @param  {String|Object} config
 * @return {Object}
 * @api public
 */

function envcfg(config) {
  config = typeof config === 'string' ? read(config) : config;
  return Object.freeze(new Config(config));
}

/**
 * Reads the `file`. Handles json and modules.
 *
 * @param  {String} file
 * @return {Object}
 * @api private
 */

function read(file) {
  var ext = file.substring(file.length - 5);
  return ext === '.json' ? JSON.parse(fs.readFileSync(file)) : require(file);
}

/**
 * Shallow copies `obj`.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function copy(obj) {
  if (!obj) return;
  var target = {};
  Object.keys(obj).forEach(function(key) {
    target[key] = obj[key];
  });
  return target;
}

/**
 * Extend object `a` with object `b`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

function extend(a, b) {
  Object.keys(b).forEach(function(key) {
    if (!a[key]) {
      a[key] = b[key];
    }
  });
  return a;
}

/**
 * Expose `Config`.
 */

exports.Config = Config;

/**
 * Config constructor.
 *
 * @param {Object}
 * @api public
 */

function Config(cfg) {
  var env = process.env.NODE_ENV || 'development';
  var settings = copy(cfg[env]) || cfg;
  var common = cfg['*'];
  var descriptors = {
    writable: false,
    configurable: false,
    enumerable: false
  };

  if (common) {
    extend(settings, common);
  }

  Object.defineProperty(this, 'env', extend({
    value: env
  }, descriptors));

  Object.keys(settings).forEach(function(key) {
    Object.defineProperty(this, key, extend({
      value: settings[key],
      enumerable: true
    }, descriptors));
  }, this);
}


