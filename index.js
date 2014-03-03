
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

function Config(cfg) {
  define(this, 'env', {
    value: process.env.NODE_ENV || 'development'
  });

  var settings = clone(cfg[this.env]) || {};
  if (cfg['*']) extend(settings, cfg['*']);

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
  return path.extname(file) === '.json'
    ? JSON.parse(fs.readFileSync(file, 'utf-8'))
    : require(file);
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

function define(context, key, value){
  Object.defineProperty(context, key, extend(value, descriptors));
}