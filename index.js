
/*!
 * Deps.
 */

var fs = require('fs');
var path = require('path');
var clone = require('clone');

/**
 * Expose `envcfg` as the module.
 */

module.exports = exports = envcfg;

/**
 * Descriptor defaults.
 *
 * @type {Object}
 * @api private
 */

var descriptors = {
  writable: false,
  configurable: false,
  enumerable: false
};

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

function Config(cfg, opts) {
  define(this, 'env', {
    value: process.env.NODE_ENV || 'development'
  });

  var settings = clone(cfg[this.env]) || {};

  if (cfg['*']) extend(settings, cfg['*'], opts.deepMerge);

  Object.keys(settings).forEach(function(key) {
    define(this, key, {
      value: settings[key],
      enumerable: true
    });
  }, this);
}

/**
 * Accessor for sugar.
 *
 * @param {String} key
 * @return {Mixed}
 * @api public
 */

Config.prototype.get = function(key){
  return this[key];
};

/**
 * Create a config into an environment aware one.
 *
 * @param  {String|Object} config
 * @return {Object}
 * @api public
 */

function envcfg(config, opts) {
  opts = opts || {};
  config = typeof config === 'string' ? read(config) : config;
  if (opts.mutable === true) {
    // allow the config object to be modified
    descriptors.writable = true;
    descriptors.configurable = true;
    descriptors.enumerable = true;
    return new Config(config, opts);
  }
  return Object.freeze(new Config(config, opts));
}

/**
 * Reads the `file`. Handles json and modules.
 *
 * @param  {String} file
 * @return {Object}
 * @api private
 */

function read(file) {
  return path.extname(file) === '.json'
    ? JSON.parse(fs.readFileSync(file, 'utf-8'))
    : require(file);
}

/**
 * Extend object `a` with object `b`. Now does deep extension if deep parameter is true.
 *
 * @param {Object} a
 * @param {Object} b
 * @param {Boolean} deep
 * @return {Object}
 * @api private
 */

function extend(a, b, deep) {
  if (deep) {
    Object.keys(b).forEach(function(key) {
      if (!a.hasOwnProperty(key)) {
        a[key] = b[key];
      } else if (b[key].constructor && b[key].constructor === Object) {
        a[key] = extend(a[key], b[key]);
      }
    });
    return a;
  }
  Object.keys(b).forEach(function(key) {
    if (!a.hasOwnProperty(key)) a[key] = b[key];
  });
  return a;
}

/**
 * Short hand descriptor creation.
 *
 * @param {Object} context
 * @param {String} key
 * @param {Object} value
 * @api private
 */

function define(context, key, value, deep){
  Object.defineProperty(context, key, extend(value, descriptors, deep));
}
