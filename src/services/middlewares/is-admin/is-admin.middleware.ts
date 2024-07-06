import { Injectable, NestMiddleware } from '@nestjs/common';
import { userRoles } from 'config/constants';

@Injectable()
export class IsAdminMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.session.roles.includes(userRoles.Admin.id)) {
      console.log(req.session.roles);
      return next();
    }
    res.status(401).send({ message: 'Unauthorized' });
  }
}
