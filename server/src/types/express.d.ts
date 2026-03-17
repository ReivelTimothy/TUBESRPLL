import { UserAttributes } from './user';
import { CheckInBody } from './attendance';

declare global {
  namespace Express {
    interface Request {
        user?: UserAttributes;
        attendance?: CheckInBody;
    }
  }
}