import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Length } from 'class-validator';

export class CreateNotificationBody {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    type: String,
    example: '30e9a347-fbcb-448d-adf0-d92475b9073b',
  })
  recipientId: string;

  @IsNotEmpty()
  @Length(5, 240)
  @ApiProperty({ type: String, example: 'notification content' })
  content: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'notification category' })
  category: string;
}
