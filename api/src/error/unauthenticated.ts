import CustomAPIError from "./cutom-error.js";
import { StatusCodes } from "http-status-codes";

class UnauthenticatedError extends CustomAPIError {
  public StatusCodes: number;

  constructor(message: string) {
    super(message);
    this.StatusCodes = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthenticatedError;
