import CustomAPIError from "./cutom-error.js";
import { StatusCodes } from "http-status-codes";

class BadRequestError extends CustomAPIError {
  public StatusCodes: number;

  constructor(message: string) {
    super(message);
    this.StatusCodes = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
