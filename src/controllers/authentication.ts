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

// export async function createUser(newUser: UserSignUp) {
//   const { error, value } = joi.validate(newUser, userSchema, {
//     skipFunctions: true,
//     stripUnknown: true,
//     abortEarly: false
//   });
//   if (error) {
//     console.log(error);

//     throw new Error('error!!!!! user is not valid!');
//   }

//   const emailExist = await Signup.findOne({ email: newUser.email });
//   if (emailExist) return new Error('Email already exists!');

//   const salt = await bcrypt.genSalt(10);
//   value.password = await bcrypt.hash(value.password, salt);
//   const contact = new Signup(value);
//   const res = await contact.save();
//   const token = jwt.sign(
//     {
//       id: res.id,
//       email: res.email,
//       firstName: res.firstName,
//       lastName: res.lastName
//     },
//     PRIVATE_KEY,
//     {
//       expiresIn: '1h'
//     }
//   );
//   console.log(res);
//   console.log(token);

//   return {
//     ...res.toObject(), //res is a mongoose doc, so we turn it to an object.
//     id: res._id,
//     token: token
//   };
// }
