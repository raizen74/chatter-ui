import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

const getCurrentUserByContext = (context: ExecutionContext): User => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  else if (context.getType<GqlContextType>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext().req.user;  // user supplied by the jwt strategy
  }

  return GqlExecutionContext.create(context).getContext().req.user;
};

export const CurrentUser = createParamDecorator(  // utility function to create route decorators
  (_data: unknown, context: ExecutionContext) =>  // context contains the request object, which in turn contains the user returned by the jwt strategy
    getCurrentUserByContext(context),
);
