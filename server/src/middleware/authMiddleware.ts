import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.model";
import { AuthenticationError } from "apollo-server-errors";

dotenv.config();

const getAuthorizedUser = async (req: any) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const { id }: any | JwtPayload = jwt.verify(
        token,
        `${process.env.JWT_SECRET}`
      );
      const user = await User.findById(id).select("-password");
      return { user };
    } catch (error) {
      console.log(error);
      throw new AuthenticationError("Not authorized, no token found");
    }
  }

  if (!token) {
    throw new AuthenticationError("Not authorized, no token");
  }
};

export default getAuthorizedUser;
