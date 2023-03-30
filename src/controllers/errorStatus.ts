export const InvalidQueryParam = class InvalidQueryParam {
  status: number;
  message: string;
  constructor(status: number, queryParamName: string) {
    this.status = status;
    this.message = `the ${queryParamName} specified is not a valid`;
  }
};

export class InvalidPostObject {
  constructor(
    public status: number = 400,
    public message: string = `bad POST request`
  ) {}
}
