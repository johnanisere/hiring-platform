import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';

interface newUser {
  name: string;
  email: string;
  password: string;
}

export async function createUser(body: newUser) {
  const salt = await bcrypt.genSalt(10);
  body.password = await bcrypt.hash(body.password, salt);

  const user = new User(body);
  const res = await user.save();
  console.log(res);

  const token = jwt.sign(
    {
      id: res.id,
      email: res.email,
      name: res.name,
    },
    PRIVATE_KEY,
    {
      expiresIn: '1h',
    },
  );

  console.log(token);

  return {
    ...res.toObject(), //res is a mongoose doc, so we turn it to an object.
    id: res._id,
    token: token,
  };
}
