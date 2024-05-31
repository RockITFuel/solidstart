import { ZodError, ZodSchema, z } from "zod";
import { fromError } from "zod-validation-error";

// Define the return type
type ParsedData<T extends ZodSchema> = z.infer<T>;

export function zodValidate<T extends ZodSchema>(schema: T, data: any): ParsedData<T> {
  try {
    if (data instanceof FormData) {
      return schema.parse(Object.fromEntries(data.entries())) as ParsedData<T>;
    }
    return schema.parse(data) as ParsedData<T>;
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromError(error);
      // the error is now readable by the user
      // you may print it to console
      console.log(validationError.toString());
      // or return it as an actual error
      throw new Error(validationError.toString());
    }
   
    throw error; // rethrow if it's not a ZodError
  }
}