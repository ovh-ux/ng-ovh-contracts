/* global describe:true, beforeEach:true, afterEach:true, it:true, expect: true */
"use strict";

describe("Directive: contracts", function () {

    var $compile;
    var $scope;
    var $httpBackend;
    var elem;

    beforeEach(angular.mock.module("ovh-angular-contracts"));
    beforeEach(angular.mock.module("templates"));

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_, $templateCache) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;

        elem = $("<div>").prependTo("body");
        $scope.$digest();

    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        $scope.$destroy();
        elem.remove();
    });

    var templates = {
        "default": {
            element: "<div data-contracts></div>",
            scope: {}
        }
    };

    function compileDirective (template, locals) {
        template = templates[template]; // eslint-disable-line no-param-reassign
        angular.extend($scope, angular.copy(template.scope) || angular.copy(templates.default.scope), locals);
        var element = $(template.element).appendTo(elem);
        element = $compile(element)($scope);
        $scope.$digest();
        return jQuery(element[0]);
    }

    // ---

    describe("Initialization", function () {

        it("should load the default directive", function () {

            var element = compileDirective("default");

            expect(element.children().hasClass("contracts-ctnr")).toBeTruthy();

        });

    });

});
