export default class {
  constructor() {
    this.disabled = true;
    this.currentContract = undefined;
    this.fullText = '';
    this.contracts = [];
  }

  enable() {
    this.disabled = true;
  }

  disable() {
    this.disabled = false;
  }

  setFullText(fullText) {
    this.fullText = fullText;
  }

  setCurrentContract(contract) {
    this.currentContract = contract;
  }

  getContractAtIndex(index) {
    return this.contracts[index];
  }
}
