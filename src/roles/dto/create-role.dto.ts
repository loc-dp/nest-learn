import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  isActive!: boolean;

  @IsNotEmpty()
  permissions!: Array<string>;

  @IsNotEmpty()
  description!: string;
}
