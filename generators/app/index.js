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
      if (true === this.options.qSourceCode.hasSourceCode) {
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
      if (true === this.options.qSourceCode.hasSourceCode) {
        var prompts = [
          {
            type: 'confirm',
            name: 'hasCreativeWork',
            message: 'Does your software project include other ' + chalk.underline('creative work') + ' (i.e. documentation, media files, tutorials) that you want to license under an appropriate license?',
            default: true,
          },
          {
            name: 'title',
            message: 'Title of Creative Work (i.e. ProjectX Documentation, Media files in the repository, Data in the archives):',
            when: function (answers) {
              return true === answers.hasCreativeWork
            }
          },
          {
            name: 'ccDir',
            message: 'Main directory where Creative Work is stored (i.e. ' + chalk.underline('docs/') + ', ' + chalk.underline('music/') + ', ' + chalk.underline('data/') + '):',
            default: 'docs/',
            when: function (answers) {
              return true === answers.hasCreativeWork
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
          when: false === this.options.qSourceCode.hasSourceCode
        },
        {
          name: 'title',
          message: 'Title of creative work (i.e. "Loud Song" Remix, Cat Video, "Book of Knowledge", Map of local coffeeshops):',
          when: function (answers) {
            return true === answers.hasCreativeWork
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
      if (false === this.options.qSourceCode.hasSourceCode
        && true === this.options.qCreativeWork.hasCreativeWork) {

          var prompts = authorPrompts;

          return this.prompt(prompts).then(function (answers) {
            // To access props later use this.props.someAnswer;
            this.options.qCreativeWorkAuthor = answers;
          }.bind(this));
        }
    },

    licenseCreativeWorkWithSourceCode() {
      if (true === this.options.qSourceCode.hasSourceCode
        && true === this.options.qSourceWithCreative.hasCreativeWork) {

          var output_file = this.options.qSourceWithCreative.ccDir + '/LICENSE';

          this.composeWith(require.resolve('generator-license-cc/generators/app'), {
            name: this.options.qSourceCodeAuthor.name,
            work: this.options.qSourceWithCreative.title,
            email: this.options.qSourceCodeAuthor.email,
            website: this.options.qSourceCodeAuthor.website,
            year: this.options.qSourceCodeAuthor.year,
            output: output_file
          });
        }
    },

    licenseCreativeWorkOnly() {
      if (this.options.qCreativeWork.hasCreativeWork) {
        this.composeWith(require.resolve('generator-license-cc/generators/app'), {
          name: this.options.qCreativeWorkAuthor.name,
          work: this.options.qCreativeWork.title,
          email: this.options.qCreativeWorkAuthor.email,
          website: this.options.qCreativeWorkAuthor.website,
          year: this.options.qCreativeWorkAuthor.year,
          output: 'LICENSE'
        });
      }
    }
  },

  writing: function () {
  },

  install: function () {
    //this.installDependencies();
  }
});
