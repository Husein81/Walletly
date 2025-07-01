import jwt from "jsonwebtoken";

const generateToken = (id: string): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET);

  return token;
};

export default generateToken;
