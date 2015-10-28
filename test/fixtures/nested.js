
module.exports = exports = {
	"*": {
		"foo": "foo-*",
		"buz": "buzz-*",
    "nest": {
      "bar": "none",
      "zing": "ga"
    }
	},
	"development": {
		"bar": "bar-development",
    "nest": {
      "bar": "exam"
    }
	},
	"test": {
		"foo": "foo-test",
		"bar": "bar-test",
    "nest": {
      "bar": "exam"
    }
	}
};
