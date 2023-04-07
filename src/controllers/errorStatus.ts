export class BaseError {
  constructor(public status: number, public message: string) {}
}

export class Error404 extends BaseError {
  constructor(resourceName: string) {
    super(404, `${resourceName} not found`);
  }
}

export class InvalidQueryParam extends BaseError {
  constructor(
    public status: number,
    public queryParamName: string = "query parameter"
  ) {
    super(status, `the ${queryParamName} specified is not a valid`);
  }
}

export class InvalidPostObject extends BaseError {
  constructor(
    public status: number = 400,
    public message: string = `bad POST request`
  ) {
    super(status, message);
  }
}
