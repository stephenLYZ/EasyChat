import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { expressjwt } from 'express-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { User } from './user.schema';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  use(req, res, next) {
    expressjwt({
      secret: process.env.JWT_SECRET_PASSWORD,
      algorithms: ['HS256'],
      isRevoked: async (req1, token) => {
        const payload = token?.payload as JwtPayload;
        if (!payload._id) {
          throw new UnauthorizedException(
            'The token contains invalid credentials or has expired',
          );
        }

        const user = await this.userModel.findById(payload._id).exec();
        if (!user) throw new UnauthorizedException('The user is not found');

        return false;
      },
    }).unless({ path: ['/api/user/create'] })(req, res, next);
  }
}
