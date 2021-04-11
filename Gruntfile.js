"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        tslint: {
            options: {
                configuration: "tslint.json"
            },
            files: {
                src: [
                    "src/*.ts",
                    "!src/*.d.ts",
                    "test/*.ts",
                    "!test/*.d.ts"
                ]
            }
        },
        ts: {
            dev: {
                tsconfig: true
            },
            prod: {
                options: {
                    sourceMap: false
                },
                tsconfig: true
            }
        },
        copy: {
            default: {
                expand: true,
                cwd: "src",
                src: ["*.js", "*.d.ts"],
                dest: "dist/"
            }
        },
        clean: {
            default: {
                src: [
                    ".tscache",
                    "coverage",
                    "src/*.js*",
                    "src/*.d.ts",
                    "test/*.js*",
                    "test/*.d.ts"
                ]
            }
        },
        watch: {
            config: {
                files: ["Gruntfile.js"],
                options: {
                    reload: true
                }
            },
            default: {
                files: [
                    "src/*.ts",
                    "test/*.ts",
                    "tsconfig.json",
                    "tslint.json"
                ],
                tasks: ["build"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("build:dev", ["tslint", "clean", "ts:dev"]);
    grunt.registerTask("build:prod", ["tslint", "clean", "ts:prod"]);
    grunt.registerTask("release", ["copy"]);

    grunt.registerTask("default", ["build:dev"]);
};
