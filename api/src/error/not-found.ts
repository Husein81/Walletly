import CustomAPIError from "./cutom-error.js";
import { StatusCodes } from "http-status-codes";

class NotFoundError extends CustomAPIError {
  public StatusCodes: number;

  constructor(message: string) {
    super(message);
    this.StatusCodes = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
