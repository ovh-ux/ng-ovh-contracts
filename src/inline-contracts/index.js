import angular from 'angular';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './component';

const moduleName = 'ngOvhInlineContracts';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
  ])
  .component('ovhInlineContracts', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
