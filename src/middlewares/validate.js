import { StatusCodes } from "http-status-codes";
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Validation error",
        errors: err.errors.map((error) => ({
          field: error.path.join("."),
          message: error.message,
        })),
      });
    }
  };
};
