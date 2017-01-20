'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var testName = 'Bob Jr.';
var testEmail = 'bob@example.org';
var testWebsite = 'https://www.example.org';
var testYear = '2013-2015';
var testTitle = 'Bob Jr. Media Files';
var ccDir = 'media/';

describe('licensor:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        hasSourceCode: true,
        name: testName,
        email: testEmail,
        website: testWebsite,
        year: testYear,
        hasCreativeWork: true,
        defaultLicense: 'MIT',
        license: 'CC-BY-SA-4.0',
        title: testTitle,
        ccDir: 'media/',
        someAnswer: true
      }).toPromise();
  });

  it('creates files', function () {
    assert.file([
      'LICENSE',
      'media/LICENSE',
    ]);
  });
});
