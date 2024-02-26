import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({ example: 'qwerty', description: 'Unique password' })
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgxNDJm....', description: 'Token' })
    @IsNotEmpty()
    readonly token: string;
}