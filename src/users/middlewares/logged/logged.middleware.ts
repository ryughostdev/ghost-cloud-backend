import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggedMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log(req.originalUrl);
    next();
  }
}
