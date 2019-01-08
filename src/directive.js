import $ from 'jquery';

import controller from './controller';
import template from './template.html';

export default function () {
  return {
    restrict: 'EA',
    template,
    scope: {
      contracts: '=',
      agree: '=contractsValidated',
    },
    controller,
    controllerAs: 'ContractsCtrl',
    bindToController: true,
    link($scope, $elm, $attr, ContractsCtrl) {
      ContractsCtrl.setFullText($attr.fullText === 'true' || $attr.fullText === undefined);

      const scrollToOptions = {
        easing: 'swing',
        duration: '300',
        offsetTop: '16',
      };

      /** AWESOME SCROLL* */
      const init = () => {
        $elm.find('.contracts-breadcrumb-navigate-previous').unbind('click');
        $elm.find('.contracts-breadcrumb-navigate-next').unbind('click');
        $elm.find('.contracts-list').unbind('scroll');
        $elm.find('.contracts-menu').undelegate('a', 'click');

        const topMenu = $elm.find('.contracts-menu');
        let lastId = 'contract-0';
        let menuItems = topMenu.find('a');
        let scrollItems;
        let initialOffSet;

        ContractsCtrl.setCurrentContract(ContractsCtrl.getContractAtIndex(0));
        ContractsCtrl.disable();


        // Fake Anchor
        topMenu.delegate('a', 'click', (e) => {
          const href = $(this).attr('data-fake-href');

          $('.contracts-list').stop().scrollTo(href, scrollToOptions);

          e.preventDefault();
        });

        $elm.find('.contracts-list').scroll((e) => {
          // enable check box
          const elem = $(e.currentTarget);
          const elemHeight = elem.outerHeight();
          const elemDiff = elem[0].scrollHeight - elem.scrollTop();

          if ((elemDiff === elemHeight) || (elemDiff - elemHeight < 5)) {
            $scope.$apply(() => {
              ContractsCtrl.enable();
            });
          }

          // Get container scroll position
          const fromTop = ($elm.find('.contracts-list').height() / 2) + $elm.find('.contracts-list').offset().top;

          if (scrollItems === undefined) {
            scrollItems = menuItems.map(() => {
              const item = $($(this).attr('data-fake-href'));
              if (initialOffSet === undefined) {
                initialOffSet = item.offset().top;
              }
              if (item.length) {
                return item;
              }
              return undefined;
            });
          }

          // Get id of current scroll item
          let cur = scrollItems.map(() => {
            if ($(this).offset().top <= fromTop) {
              return this;
            }
            return undefined;
          });

          // Get the id of the current element
          cur = cur[cur.length - 1];
          const id = cur && cur.length ? cur[0].id : 'contract-0';
          if (lastId !== id) {
            lastId = id;

            $scope.$apply(() => {
              ContractsCtrl.setCurrentContract(
                ContractsCtrl.getContractAtIndex(parseInt(lastId.split('-')[1], 10)),
              );
            });

            menuItems
              .removeClass('active')
              .parent()
              .end()
              .filter(`[data-fake-href="#${id}"]`)
              .addClass('active');
          }
        });

        $elm.find('.contracts-breadcrumb-navigate-previous').click(() => {
          if (lastId) {
            $elm.find('.contracts-list').stop().scrollTo(`#contract-${parseInt(lastId.split('-')[1], 10) - 1}`, scrollToOptions);
          }
        });

        $elm.find('.contracts-breadcrumb-navigate-next').click(() => {
          if (lastId) {
            $elm.find('.contracts-list').stop().scrollTo(`#contract-${parseInt(lastId.split('-')[1], 10) + 1}`, scrollToOptions);
          }
        });

        menuItems
          .removeClass('active')
          .parent()
          .end()
          .filter(`[data-fake-href="#${lastId}"]`)
          .addClass('active');

        window.setTimeout(() => {
          $elm.find('.contracts-list').stop().scrollTo(0);
          menuItems = topMenu.find('a'); // because ngRepeat is not already here ;p
        }, 300);
      };

      $scope.$watch(() => ContractsCtrl.contracts, (nv) => {
        if (nv !== undefined) {
          init();
        }
      });
    },
  };
}
