import { UserRole } from 'src/users/entities/user.entity';

declare namespace Express {
  namespace Multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
  }
}

declare global {
  namespace Express {
    interface User {
      id: string; // Ensure this is a valid type
      email: string;
      role: UserRole; // Change to UserRole type for better type safety
    }
  }
}
