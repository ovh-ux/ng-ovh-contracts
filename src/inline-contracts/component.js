import template from './template.html';

const component = {
  bindings: {
    contracts: '<items',
    model: '=',
  },
  template,
};

export default component;
