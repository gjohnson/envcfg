'use strict';

var envcfg = require('../index');
var path = require('path');
var assert = require('assert');

describe('envcfg', function() {

	var config = envcfg(path.join(__dirname + '/fixtures/basic.json'));

	describe('#envcfg(path)', function() {
		it("should create from a json file path", function() {
			var config = envcfg(path.join(__dirname + '/fixtures/basic.json'));
			assert(config instanceof envcfg.Config);
		});

		it("should create from a module path", function() {
			var config = envcfg(path.join(__dirname + '/fixtures/basic'));
			assert(config instanceof envcfg.Config);
		});
	});

	describe('#envcfg(object)', function() {
		it("should create from an object", function() {
			var config = envcfg(require(path.join(__dirname + '/fixtures/basic')));
			assert(config instanceof envcfg.Config);
		});
	});

	describe('#.env', function() {
		it('should expose the detected environment', function() {
			assert.equal(config.env, process.env.NODE_ENV);
		});

		it('should not be enumerable', function() {
			var enumerable = Object.getOwnPropertyDescriptor(config, 'env').enumerable;
			assert(enumerable === false);
		});
	});

	describe('#.setting', function() {
		it('should provide the setting value based on environment', function() {
			assert.equal(config.foo, 'foo-test');
			assert.equal(config.bar, 'bar-test');
			assert.equal(config.buz, 'buzz-*');
		});

		it('should not be possible to change a value', function() {
			assert.throws(function() {
				config.foo = 'foo-changed';
			}, Error);
			assert.equal(config.foo, 'foo-test');
		});

		it('should not be possible to delete values', function() {
			assert.throws(function() {
				delete config.foo;
			}, Error);
			assert.equal(config.foo, 'foo-test');
		});

		it('should not be possible to add new values', function() {
			assert.throws(function(){
				config.whatever = 'whatever';
				assert.strictEqual(config.whatever, undefined);
			}, Error);
		});
	});

	describe('#Object.keys(config)', function() {
		it('should only iterate config values', function() {
			assert.equal(Object.keys(config).length, 3);
		});
	});

});