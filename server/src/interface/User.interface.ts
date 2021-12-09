import Joi from "joi";

export default interface UserInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  location: string;
  isAdmin: boolean;
}

export const userValidationSchema = Joi.object({
  id: Joi.string(),
  firstName: Joi.string().label("First Name").min(3).max(50).required(),
  lastName: Joi.string().label("Last Name").min(3).max(50).required(),
  email: Joi.string().label("Email").email().required(),
  password: Joi.string().label("password").min(8).max(20).required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
  phoneNumber: Joi.string().label("Phone Number").required(),
  address: Joi.string().label("Address").required(),
  city: Joi.string().label("City").required(),
  country: Joi.string().label("Country").required(),
  state: Joi.string().label("State").required(),
  zip: Joi.string().label("Zip").required(),
  location: Joi.string().label("Location").required(),
  isAdmin: Joi.boolean().label("Is Admin"),
});

export const authUserValidation = Joi.object({
  email: Joi.string().label("Email").email().required(),
  password: Joi.string().label("password").min(8).max(20).required(),
});
