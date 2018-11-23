/**
 * @ngdoc overview
 * @name ovh-angular-contracts
 * @description
 * # contracts
 *
 * Main module of the application.
 */
import angular from 'angular';
import 'angular-translate';
import 'angular-ui-bootstrap';

import contracts from './ovh-angular-contracts.directive';

import './ovh-angular-contracts.less';

const moduleName = 'ovh-angular-contracts';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.bootstrap',
  ])
  .directive('contracts', contracts)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
