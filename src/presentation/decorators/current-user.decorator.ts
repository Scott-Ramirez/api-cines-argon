import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '../../domain/models/user.model';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserModel => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
