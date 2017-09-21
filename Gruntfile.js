// Generated on 2015-09-15 using generator-ovh-angular-component 0.0.0
module.exports = function (grunt) {
    "use strict";
    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: grunt.file.readJSON("bower.json"),
        distdir: "dist",
        srcdir: "src",
        builddir: ".work/.tmp",
        name: grunt.file.readJSON("package.json").name || "ovh-angular-contracts", // module name

        // Clean
        clean: {
            dist: {
                src: [
                    "<%= builddir %>",
                    "<%= distdir %>"
                ]
            }
        },

        // Copy files
        copy: {
            // Copy concatened JS file from builddir to dist/
            dist: {
                files: {
                    "<%= distdir %>/ovh-angular-contracts.js": "<%= builddir %>/ovh-angular-contracts.js"
                }
            }
        },

        // Concatenation
        concat: {
            dist: {
                files: {
                    "<%= builddir %>/ovh-angular-contracts.js": [
                        "<%= srcdir %>/ovh-angular-contracts.js",
                        "<%= srcdir %>/**/*.js",
                        "!<%= srcdir %>/**/*.spec.js",
                        "<%= builddir %>/tpls.js"
                    ]
                }
            }
        },

        // ngMin
        ngAnnotate: {
            dist: {
                files: {
                    "<%= builddir %>/ovh-angular-contracts.js": ["<%= builddir %>/ovh-angular-contracts.js"]
                }
            }
        },

        // Obfuscate
        uglify: {
            js: {
                options: {
                    banner: '/*! ovh-angular-contracts - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    "<%= distdir %>/ovh-angular-contracts.min.js": ["<%= builddir %>/ovh-angular-contracts.js"]
                }
            }
        },

        ngtemplates: {
            options: {
                module: "ovh-angular-contracts",
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            dist: {
                cwd: "<%= srcdir %>/",
                src: ["**/*.html"],
                dest: "<%= builddir %>/tpls.js"
            }
        },

        // JS Check
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require("jshint-stylish")
            },
            js: [
                "<%= srcdir %>/*.js",
                "<%= srcdir %>/*/*.js",
                "!<%= srcdir %>/**/*.spec.js"
            ]
        },

        // Check complexity
        complexity: {
            generic: {
                src: [
                    "<%= srcdir %>/**/*.js",
                    "!<%= srcdir %>/**/*.spec.js"
                ],
                options: {
                    errorsOnly: false,
                    cyclomatic: 12,
                    halstead: 45,
                    maintainability: 82
                }
            }
        },

        // Watch
        delta: {
            dist: {
                files: ["<%= srcdir %>/**/*", "!<%= srcdir %>/**/*.spec.js"],
                tasks: ["build"]
            },
            test: {
                files: ["<%= srcdir %>/**/*.spec.js"],
                tasks: ["test"]
            }
        },

        // To release
        bump: {
            options: {
                pushTo: "origin",
                files: [
                    "package.json",
                    "bower.json"
                ],
                updateConfigs: ["pkg", "bower"],
                commitFiles: ["-a"]
            }
        },

        // Testing
        karma: {
            unit: {
                configFile: "karma.conf.js",
                singleRun: true
            }
        },

        // Documentation
        ngdocs: {
            options: {
                dest: "docs",
                html5Mode: false,
                startPage: "docs/ovh-angular-contracts.directive:contracts",
                title: "ovh-angular-contracts",
                sourceLink: "https://github.com/ovh-ux/<%= name %>/blob/master/{{file}}#L{{codeline}}"
            },
            docs: {
                src: ["src/**/*.js"],
                title: "docs",
                api: true
            }
        },

        eslint: {
            options: {
                configFile: "./.eslintrc.json"
            },
            target: ["src/**/!(*.spec|*.integration).js", "Gruntfile.js"]
        }
    });

    grunt.registerTask("default", ["build"]);
    grunt.task.renameTask("watch", "delta");
    grunt.registerTask("watch", ["build", "delta"]);

    grunt.registerTask("test", function () {
        grunt.task.run([
            "clean",
            "jshint",
            "eslint",
            "complexity"

            // "karma"
        ]);
    });

    grunt.registerTask("build", [
        "clean",
        "ngtemplates",
        "concat:dist",
        "ngAnnotate",
        "uglify",
        "copy:dist",
        "ngdocs"
    ]);


    // Increase version number. Type = minor|major|patch
    grunt.registerTask("release", "Release", function () {
        var type = grunt.option("type");

        if (type && ~["patch", "minor", "major"].indexOf(type)) {
            grunt.task.run(["bump-only:" + type]);
        } else {
            grunt.verbose.or.write("You try to release in a weird version type [" + type + "]").error();
            grunt.fail.warn("Please try with --type=patch|minor|major");
        }
    });

};
