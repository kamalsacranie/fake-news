exports.InvalidQueryParam = class InvalidQueryParam {
  constructor(status, queryParamName) {
    this.status = status;
    this.message = `the ${queryParamName} specified is not a valid`;
  }
};

exports.InvalidPostObject = class InvalidPostObject {
  constructor() {
    this.status = 400;
    this.message = `bad POST request`;
  }
};
