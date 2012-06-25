
export NODE_ENV = test

TESTS = $(shell find test/*.test.js)

test:
	@./node_modules/.bin/mocha -r should -u bdd -R spec $(TESTS)

.PHONY: test
