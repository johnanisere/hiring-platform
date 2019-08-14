import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';
import User from '../models/User';
// import { promisify } from 'util';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers['authorization'];
  const actualToken = token ? token.split(' ')[1] : '';
  jwt.verify(actualToken, PRIVATE_KEY, (err, payload) => {
    if (payload) {
      User.findById(payload).then(doc => {
        req.body.user = doc;
        return next();
      });
    }
    return res.status(401).send(err);
  });
  return res.status(401).json({ message: 'UnAuthorised' });
}

// export async function protect(req: Request, res: Response, next: NextFunction) {
//   //check if there's a token
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: 'You are not logged in. Please log in to get access.' });
//   }

//   //token verification
//   const decoded: any = await promisify(jwt.verify)(token, PRIVATE_KEY);

//   //check if user still exists
//   const currentUser = await User.findById(decoded.id);
//   if (!currentUser) {
//     return res
//       .status(401)
//       .json({ message: 'User with token no longer exists.' });
//   }

//   req.body.user = currentUser;

//   next();
// }

// export const isAdmin = (role: String) => {
//   return (req: Request, res: Response, _next: NextFunction) => {
//     if (role !== req.body.user.role) {
//       res.status(403).json({ message: 'You do not have permisson to perform this action.' });
//     }
//   };
// };
