
var envcfg = require('../index');
var path = require('path');
var should = require('should');

describe('envcfg', function() {

	var config = envcfg(path.join(__dirname + '/fixtures/basic.json'));

	describe('#envcfg(path)', function() {
		it("should create from a json file path", function() {
			var config = envcfg(path.join(__dirname + '/fixtures/basic.json'));
			config.should.be.instanceof(envcfg.Config);
		});

		it("should create from a module path", function() {
			var config = envcfg(path.join(__dirname + '/fixtures/basic'));
			config.should.be.instanceof(envcfg.Config);
		});
	});

	describe('#envcfg(object)', function() {
		it("should create from an object", function() {
			var config = envcfg(require(path.join(__dirname + '/fixtures/basic')));
			config.should.be.instanceof(envcfg.Config);
		});
	});

	describe('#.env', function() {
		it('should expose the detected environment', function() {
			config.env.should.equal(process.env.NODE_ENV);
		});

		it('should not be enumerable', function() {
			var enumerable = Object.getOwnPropertyDescriptor(config, 'env').enumerable;
			enumerable.should.not.be.true;
		});
	});

	describe('#.setting', function() {
		it('should provide the setting value based on environment', function() {
			config.foo.should.equal('foo-test');
			config.bar.should.equal('bar-test');
			config.buz.should.equal('buzz-*');
		});

		it('should not be possible to change a value', function() {
			config.foo.should.equal('foo-test');
			config.foo = 'foo-changed';
			config.foo.should.equal('foo-test');
		});

		it('should not be possible to delete values', function() {
			config.foo.should.equal('foo-test');
			delete config.foo;
			config.foo.should.equal('foo-test');
		});

		it('should not be possible to add new values', function() {
			config.whatever = 'whatever';
			should.strictEqual(config.whatever, undefined);
		});
	});

	describe('#Object.keys(config)', function() {
		it('should only iterate config values', function() {
			Object.keys(config).should.have.lengthOf(3);
		});
	});

});