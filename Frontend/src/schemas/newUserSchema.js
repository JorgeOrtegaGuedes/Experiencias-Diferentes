// Importamos joi.
import joi from "joi";
import { joiErrorMessages } from "./joiErrorMessages.js";

// Esquema para validar el body de la petición. y mensaje de error con joi
export const newUserSchema = joi.object({
  username: joi.string().min(3).max(30).required().messages(joiErrorMessages),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required()
    .messages(joiErrorMessages),
  password: joi
    .string()
    .min(8)
    .max(16)
    .pattern(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@¡!$%^&*()_+|~=`{}:";'<>?,.])[a-zA-Z0-9@¡!$%^&*()_+|~=`{}:";'<>?,.]{8,}$/
    )
    .required()
    .messages(joiErrorMessages),
  role: joi.string().valid("admin", "public").messages(joiErrorMessages),
});
