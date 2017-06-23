/**
 * @ngdoc overview
 * @name contracts
 * @description
 * # contracts
 *
 * Main module of the application.
 */
angular.module('ovh-angular-contracts', []);

/**
 * @ngdoc directive
 * @name contracts.directive:contracts
 * @description
 * # contracts
 */
angular.module('ovh-angular-contracts').directive('contracts', function () {
    'use strict';
    return {
        restrict : 'EA',
        templateUrl: 'js/ovh-angular-contracts/ovh-angular-contracts.html',
        scope : {
            contracts : '=',
            agree     : '=contractsValidated'
        },
        controller: function () {
            this.disabled = true;
        },
        controllerAs: 'ContractsCtrl',
        bindToController: true,
        link : function ($scope, $elm, $attr, ContractsCtrl) {

            ContractsCtrl.fullText = $attr.fullText === "true" || $attr.fullText === undefined;

            var scrollToOptions = {
                'easing'  : 'swing',
                'duration' : '300',
                'offsetTop'  : '16'
            };

            $scope.$watch(function () {
                return ContractsCtrl.contracts;
            }, function (nv) {
                if (nv !== undefined) {
                    init();
                }
            });

            /**AWESOME SCROLL**/
            var init = function () {

                $elm.find('.contracts-breadcrumb-navigate-previous').unbind('click');
                $elm.find('.contracts-breadcrumb-navigate-next').unbind('click');
                $elm.find('.contracts-list').unbind('scroll');
                $elm.find(".contracts-menu").undelegate('a', 'click');

                var topMenu = $elm.find(".contracts-menu");
                var lastId = 'contract-0';
                var menuItems = topMenu.find("a");
                var scrollItems;
                var initialOffSet;

                ContractsCtrl.currentContract = ContractsCtrl.contracts[0];
                ContractsCtrl.disabled = true;


                //Fake Anchor
                topMenu.delegate('a', 'click', function(e){
                    var href = $(this).attr("data-fake-href");

                    $('.contracts-list').stop().scrollTo(href, scrollToOptions);

                    e.preventDefault();
                });

                $elm.find('.contracts-list').scroll(function (e) {

                    // enable check box
                    var elem = $(e.currentTarget),
                        elemHeight = elem.outerHeight(),
                        elemDiff = elem[0].scrollHeight - elem.scrollTop();

                    if ( (elemDiff === elemHeight) || (elemDiff - elemHeight < 5) ) {
                        $scope.$apply(function () {
                            ContractsCtrl.disabled = false;
                        });
                    }

                    // Get container scroll position
                    var fromTop =  $elm.find('.contracts-list').height()/2 +  $elm.find('.contracts-list').offset().top;

                    if (scrollItems === undefined) {
                        scrollItems = menuItems.map(function() {
                            var item = $($(this).attr("data-fake-href"));
                            if (initialOffSet === undefined) {
                                initialOffSet = item.offset().top;
                            }
                            if (item.length) {
                                return item;
                            }
                        });
                    }

                    // Get id of current scroll item
                    var cur = scrollItems.map(function(){
                        if ($(this).offset().top <= fromTop) {
                            return this;
                        }
                    });

                    // Get the id of the current element
                    cur = cur[cur.length-1];
                    var id = cur && cur.length ? cur[0].id : 'contract-0';
                    if (lastId !== id) {
                        lastId = id;
                        $scope.$apply(function () {
                            ContractsCtrl.currentContract = ContractsCtrl.contracts[id.split('-')[1]];
                        });
                        menuItems.removeClass("active").parent().end().filter("[data-fake-href=#" + id + "]").addClass("active");
                    }
                });

                $elm.find('.contracts-breadcrumb-navigate-previous').click(function () {
                    if (lastId) {
                        $elm.find('.contracts-list').stop().scrollTo('#contract-' + (parseInt(lastId.split('-')[1], 10) - 1), scrollToOptions);
                    }
                });

                $elm.find('.contracts-breadcrumb-navigate-next').click(function () {
                    if (lastId) {
                        $elm.find('.contracts-list').stop().scrollTo('#contract-' + (parseInt(lastId.split('-')[1], 10) + 1), scrollToOptions);
                    }
                });

                menuItems.removeClass("active").parent().end().filter("[data-fake-href=#" + lastId + "]").addClass("active");
                window.setTimeout(function () {
                    $elm.find('.contracts-list').stop().scrollTo(0);
                    menuItems = topMenu.find("a");  // because ngRepeat is not already here ;p
                } ,300);
            };

        }
    };
});

angular.module('ovh-angular-contracts').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('js/ovh-angular-contracts/ovh-angular-contracts.html',
    "<div class=contracts-ctnr><div data-ng-if=\"ContractsCtrl.fullText === false\"><table class=\"table table-striped table-bordered\"><tr data-ng-repeat=\"contract in ContractsCtrl.contracts\"><td><a class=bold target=_blank data-ng-href=\"{{contract.url || contract.pdf}}\"><i class=\"fa fa-file-pdf-o fs14\"></i> {{contract.name}}</a></td></tr></table><div class=contracts-agree-ctnr><flat-checkbox><input type=checkbox id=validateContract name=validateContract data-ng-model=\"ContractsCtrl.agree\"></flat-checkbox><label class=\"pointer left-space-m8 bottom-space-m0\" for=validateContract><span data-ng-if=\"ContractsCtrl.contracts.length > 1\" data-translate=contracts_agree></span> <span data-ng-if=\"ContractsCtrl.contracts.length === 1\" data-translate=contract_agree></span></label></div></div><div data-ng-if=\"ContractsCtrl.fullText === true\"><p class=bold data-ng-if=\"ContractsCtrl.contracts.length > 1\" data-translate=contracts_list_title data-translate-values=\"{'nbr': ContractsCtrl.contracts.length}\"></p><p class=bold data-ng-if=\"ContractsCtrl.contracts.length === 1\" data-translate=contract_list_title></p><div class=\"contracts-list clearfix shadow-z-1\"><uib-accordion close-others=false class=clearfix><uib-accordion-group heading={{contract.name}} is-open=true data-ng-repeat=\"contract in ContractsCtrl.contracts\" id=contract-{{$index}}><pre class=contracts-content>{{contract.content || contract.text}}</pre></uib-accordion-group></uib-accordion></div><div class=\"contracts-breadcrumb top-space-m8 bottom-space-m4 text-center clearfix\" role=navigation data-ng-show=\"ContractsCtrl.contracts.length > 1\"><a class=\"pull-left contracts-breadcrumb-navigate contracts-breadcrumb-navigate-previous\"><i class=\"glyphicon glyphicon-chevron-left\"></i> <span data-translate=contract_previous></span></a><ul class=\"contracts-menu list-unstyled\"><li class=contracts-breadcrumb-navigate data-ng-repeat=\"contract in ContractsCtrl.contracts\"><a title={{contract.name}} data-fake-href=#contract-{{$index}} data-ng-class=\"{\n" +
    "                            'active' : ContractsCtrl.currentContract.name == contract.name\n" +
    "                       }\"></a></li></ul><a class=\"pull-right contracts-breadcrumb-navigate contracts-breadcrumb-navigate-next\"><span data-translate=contract_next></span> <i class=\"glyphicon glyphicon-chevron-right\"></i></a></div><a title={{contract.name}} target=_blank class=\"block text-center text-muted fs10 top-space-m4 bottom-space-m4\" data-ng-href=\"{{ContractsCtrl.currentContract.url || ContractsCtrl.currentContract.pdf}}\" data-ng-if=ContractsCtrl.currentContract.name><i class=\"fa fa-file-pdf-o fs14\"></i> <span data-translate=contract_download data-translate-values=\"{'id': ContractsCtrl.currentContract.name}\"></span></a><div class=\"contracts-agree-ctnr top-space-m16 bottom-space-m16 space-p16\"><flat-checkbox><input type=checkbox id=validateContract name=validateContract data-ng-model=\"ContractsCtrl.agree\"></flat-checkbox><label class=\"pointer left-space-m8 bottom-space-m0\" for=validateContract><span data-ng-if=\"ContractsCtrl.contracts.length > 1\" data-translate=contracts_agree></span> <span data-ng-if=\"ContractsCtrl.contracts.length === 1\" data-translate=contract_agree></span></label></div></div></div>"
  );

}]);
