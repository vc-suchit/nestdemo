export class CreateContactDto {
  firstName: string;

  lastName: string;

  phone: number;

  email: string;

  completedAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;
}
