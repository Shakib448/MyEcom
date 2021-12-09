import Joi from "joi";

export default interface UserInterface {
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
}

export const userValidationSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string().label("Name").min(3).max(50).required(),
  image: Joi.string().label("Image").required(),
  description: Joi.string().label("Description").required(),
  brand: Joi.string().label("Brand").required(),

  category: Joi.string().label("Category").required(),
  price: Joi.number().label("Price").required(),
  countInStock: Joi.number().label("Count In Stock").required(),
  rating: Joi.number().label("Raring").required(),
  numReviews: Joi.number().label("Number Reviews").required(),
});
