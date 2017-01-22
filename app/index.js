'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var authorPrompts = [
  {
    name: 'name',
    message: 'Author\'s Name:',
    required: true
  },
  {
    name: 'email',
    message: 'Author\'s Email:',
    required: true
  },
  {
    name: 'website',
    message: 'Author\'s Website (optional):',
    required: true
  },
  {
    name: 'year',
    message: 'Year(s) to include on the license (i.e. 2016-2017):',
    required: true,
    default: (new Date()).getFullYear()
  }
];

module.exports = Generator.extend({
  prompting: {
    qSourceCode() {
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the dazzling ' + chalk.red('yo licensor') + '!'
      ));

      var prompts = [
        {
          type: 'confirm',
          name: 'hasSourceCode',
          message: 'Do you want to license ' + chalk.underline('source code') + ' of a software project?',
          default: true
        }
      ];

      return this.prompt(prompts).then(function (answers) {
        // To access props later use this.props.someAnswer;
        this.options.qSourceCode = answers;
      }.bind(this));
    },

    qSourceCodeAuthor() {
      if (this.options.qSourceCode.hasSourceCode) {
        var prompts = authorPrompts;

        return this.prompt(prompts).then(function (answers) {
          // To access props later use this.props.someAnswer;
          this.options.qSourceCodeAuthor = answers;
        }.bind(this));
      }
    },

    doLicenseSourceCode() {
      if (this.options.qSourceCode.hasSourceCode === true) {
        this.log(yosay(
          'Generating LICENSE for ' + chalk.red.underline('Source Code') + '!'
        ));

        this.composeWith(require.resolve('generator-license/app'), {
          name: this.options.qSourceCodeAuthor.name,
          email: this.options.qSourceCodeAuthor.email,
          website: this.options.qSourceCodeAuthor.website,
          year: this.options.qSourceCodeAuthor.year
        });
      }
    },

    qSourceWithCreative() {
      if (this.options.qSourceCode.hasSourceCode === true) {
        var prompts = [
          {
            type: 'confirm',
            name: 'hasCreativeWork',
            message: 'Does your software project include other ' + chalk.underline('creative work') + ' (i.e. documentation, media files, tutorials) that you want to license under an appropriate license?',
            default: true
          },
          {
            name: 'creativeWork',
            message: 'Title of Creative Work (i.e. ProjectX Documentation, Media files in the repository, Data in the archives):',
            when: function (answers) {
              return answers.hasCreativeWork === true;
            }
          },
          {
            name: 'ccDir',
            message: 'Main directory where Creative Work is stored (i.e. ' + chalk.underline('docs/') + ', ' + chalk.underline('music/') + ', ' + chalk.underline('data/') + '):',
            default: 'docs/',
            when: function (answers) {
              return answers.hasCreativeWork === true;
            }
          }
        ];

        return this.prompt(prompts).then(function (answers) {
          // To access props later use this.props.someAnswer;
          this.options.qSourceWithCreative = answers;
        }.bind(this));
      }
    },

    qCreativeWork() {
      var prompts = [
        {
          type: 'confirm',
          name: 'hasCreativeWork',
          message: 'Do you want to license ' + chalk.underline('creative work') + ' (i.e. audio/video files, written matterial, database data)?',
          default: true,
          when: this.options.qSourceCode.hasSourceCode === false
        },
        {
          name: 'creativeWork',
          message: 'Title of creative work (i.e. "Loud Song" Remix, Cat Video, "Book of Knowledge", Map of local coffeeshops):',
          when: function (answers) {
            return answers.hasCreativeWork === true;
          }
        }
      ];

      return this.prompt(prompts).then(function (answers) {
        // To access props later use this.props.someAnswer;
        this.options.qCreativeWork = answers;
      }.bind(this));
    },

    qCreativeWorkAuthor() {
      // only prompt this if it wasn't already answered and is required
      if (this.options.qSourceCode.hasSourceCode === false &&
      this.options.qCreativeWork.hasCreativeWork === true) {
        var prompts = authorPrompts;

        return this.prompt(prompts).then(function (answers) {
          // To access props later use this.props.someAnswer;
          this.options.qCreativeWorkAuthor = answers;
        }.bind(this));
      }
    },

    licenseSourceCodeWithCreativeWork() {
      if (this.options.qSourceCode.hasSourceCode === true &&
      this.options.qSourceWithCreative.hasCreativeWork === true) {
        this.composeWith(require.resolve('generator-license/app'), {
          name: this.options.qSourceCodeAuthor.name,
          email: this.options.qSourceCodeAuthor.email,
          website: this.options.qSourceCodeAuthor.website,
          year: this.options.qSourceCodeAuthor.year,
          licensePrompt: 'Choose a license for source code:'
        });

        var outputFile = this.options.qSourceWithCreative.ccDir + '/LICENSE';

        this.composeWith(require.resolve('generator-license-cc/app'), {
          name: this.options.qSourceCodeAuthor.name,
          ccWork: this.options.qCreativeWork.creativeWork,
          email: this.options.qSourceCodeAuthor.email,
          website: this.options.qSourceCodeAuthor.website,
          year: this.options.qSourceCodeAuthor.year,
          licensePrompt: 'Choose a license for creative work:',
          output: outputFile
        });
      }
    },

    licenseSourceCodeOnly() {
      if (this.options.qSourceCode.hasSourceCode === true &&
      this.options.qSourceWithCreative.hasCreativeWork === false) {
        this.composeWith(require.resolve('generator-license/app'), {
          name: this.options.qSourceCodeAuthor.name,
          email: this.options.qSourceCodeAuthor.email,
          website: this.options.qSourceCodeAuthor.website,
          year: this.options.qSourceCodeAuthor.year,
          licensePrompt: 'Choose a license for source code:'
        });
      }
    },

    licenseCreativeWorkOnly() {
      if (this.options.qCreativeWork.hasCreativeWork) {
        this.composeWith(require.resolve('generator-license-cc/app'), {
          name: this.options.qCreativeWorkAuthor.name,
          ccWork: this.options.qCreativeWork.creativeWork,
          email: this.options.qCreativeWorkAuthor.email,
          website: this.options.qCreativeWorkAuthor.website,
          year: this.options.qCreativeWorkAuthor.year,
          licensePrompt: 'Choose a license for creative work:',
          output: 'LICENSE'
        });
      }
    }
  },

  writing: function () {
  },

  install: function () {
  }
});
