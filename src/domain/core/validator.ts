import * as Joi from "@hapi/joi";

interface ValidationDetails {
  [key: string]: string;
}

export class ValidationError extends Error {
  public static fromJoiError(error: Joi.ValidationError): ValidationError {
    const details = error.details.reduce(
      (errors, detail) => ({
        ...errors,
        [detail.path.join(".")]: detail.type
      }),
      {}
    );

    return new ValidationError(details);
  }

  constructor(public details: ValidationDetails) {
    super("error.validation");
  }
}

export const validate = (data: any, schema: Joi.JoiObject): void => {
  const result = Joi.validate(data, schema, { abortEarly: false });

  if (result.error) {
    throw ValidationError.fromJoiError(result.error);
  }
};

export class NotFoundError extends Error {}
