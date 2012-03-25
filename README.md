# envcfg

envcfg is an environment aware configuration module. It is inspired by settings and cfg.

It can load configurations from json files, modules or just plain objects. Do note that when loading from disk `readFileSync` or `require` will be used.

## Usage

The configuration can be broken down by environment, with the special `*` key which can be used to share common settings across all environments.

### Files

Files can be loaded by passing the path to file that follows the structure above. If the file ends in `.json` it will be assumed it is a JSON file and will be parsed accordingly. 

```javascript
var envcfg = require('envcfg');
var config = envcfg(__dirname + '/path/to/config.json');
```

```javascript
{
	"*": {
		"foo": "foo-*",
		"buz": "buzz-*"
	},
	"development": {
		"bar": "bar-development"
	},
	"test": {
		"foo": "foo-test",
		"bar": "bar-test"
	}
}
```

### Modules

Loading modules by path is not different than loading JSON besides the naming convention. Just be sure the module sets it's `module.exports` to the configuration.

```javascript
var envcfg = require('envcfg');
var config = envcfg(__dirname + '/path/to/config_module');
```

```javascript
module.exports = exports = {
	"*": {
		"foo": "foo-*",
		"buz": "buzz-*"
	},
	"development": {
		"bar": "bar-development"
	},
	"test": {
		"foo": "foo-test",
		"bar": "bar-test"
	}
}
```

### Programmatically

It is also possible to pass in a plain object.

```javascript
var config = require('envcfg')({
	"*": {
		"foo": "foo-*",
		"buz": "buzz-*"
	},
	"development": {
		"bar": "bar-development"
	},
	"test": {
		"foo": "foo-test",
		"bar": "bar-test"
	}
});
```

### Mutability

Ever have anyone muck around with your configuration settings? No worries, the object returned from `envcfg` cannot be tampered with.

```javascript
var config = require('envcfg')({
	"*": {
		"foo": "foo-*",
		"buz": "buzz-*"
	},
	"development": {
		"bar": "bar-development"
	},
	"test": {
		"foo": "foo-test",
		"bar": "bar-test"
	}
});

// ignores re-setting
console.log(config.buz); // => "buzz-*"
config.buzz = "buzz off";
console.log(config.buz); // => "buzz-*"

// actually ignores everything...
config.something_new = 'wtf';
console.log(config.something_new); // => undefined
```












