'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var testName = 'Bob Jr.';
var testEmail = 'bob@example.org';
var testWebsite = 'https://example.org';
var testYear = '2013-2015';
var testTitle = 'Bob Jr. Media Files';
var testLicense = 'MIT';
var testCCLicense = 'CC-BY-4.0';
var ccDir = 'media/';

var testHeader = 'Copyright (c) 2013-2015 Bob Jr. <bob@example.org> (https://example.org)';
var testCCHeader = 'Bob Jr. Media Files (c) 2013-2015 Bob Jr. <bob@example.org> (https://example.org)';

describe('licensor:app - licenses for source code and creative work', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../app'))
      .withPrompts({
        hasSourceCode: true,
        name: testName,
        email: testEmail,
        website: testWebsite,
        year: testYear,
        hasCreativeWork: true,
        creativeWork: testTitle,
        license: testLicense,
        ccLicense: testCCLicense,
        ccDir: ccDir
      }).toPromise();
  });

  it('creates LICENSE files', function () {
    assert.file([
      'LICENSE',
      'media/LICENSE'
    ]);
  });

  it('creates correct ' + testLicense + ' LICENSE for source code', function () {
    assert.fileContent('LICENSE', 'The MIT License (MIT)');
    assert.fileContent('LICENSE', testHeader);
  });

  it('creates correct ' + testCCLicense + ' LICENSE for creative work', function () {
    assert.fileContent(ccDir + 'LICENSE', testCCHeader);
    assert.fileContent(ccDir + 'LICENSE', 'Creative Commons Attribution 4.0 International License.');
    assert.fileContent(ccDir + 'LICENSE', 'creativecommons.org/licenses/by/4.0');
    assert.fileContent(ccDir + 'LICENSE', 'Attribution 4.0 International');
  });
});

describe('licensor:app - license for source code only', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../app'))
      .withPrompts({
        hasSourceCode: true,
        name: testName,
        email: testEmail,
        website: testWebsite,
        year: testYear,
        hasCreativeWork: false,
        license: testLicense
      }).toPromise();
  });

  it('creates LICENSE file', function () {
    assert.file([
      'LICENSE'
    ]);
  });

  it('creates correct ' + testLicense + ' LICENSE for source code', function () {
    assert.fileContent('LICENSE', 'The MIT License (MIT)');
    assert.fileContent('LICENSE', testHeader);
  });
});

describe('licensor:app - license for creative only', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../app'))
      .withPrompts({
        hasSourceCode: false,
        hasCreativeWork: true,
        name: testName,
        email: testEmail,
        website: testWebsite,
        year: testYear,
        creativeWork: testTitle,
        ccLicense: testCCLicense
      }).toPromise();
  });

  it('creates LICENSE file', function () {
    assert.file([
      'LICENSE'
    ]);
  });

  it('creates correct ' + testCCLicense + ' LICENSE for creative work', function () {
    assert.fileContent('LICENSE', testCCHeader);
    assert.fileContent('LICENSE', 'Creative Commons Attribution 4.0 International License.');
    assert.fileContent('LICENSE', 'creativecommons.org/licenses/by/4.0');
    assert.fileContent('LICENSE', 'Attribution 4.0 International');
  });
});
