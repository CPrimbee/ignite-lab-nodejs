import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '@application/entities/notification';

export class NotificationViewModel {
  static toHTTP(notification: Notification): NotificationViewModelBody {
    return {
      id: notification.id,
      content: notification.content.value,
      category: notification.category,
      recipientId: notification.recipientId,
    };
  }
}

export class NotificationViewModelBody {
  @ApiProperty({
    type: String,
    example: '5307f9c0-1958-49ea-9ac7-297f7ee8191b',
  })
  id: string;

  @ApiProperty({ type: String, example: 'notification content' })
  content: string;

  @ApiProperty({ type: String, example: 'notification category' })
  category: string;

  @ApiProperty({
    type: String,
    example: '30e9a347-fbcb-448d-adf0-d92475b9073b',
  })
  recipientId: string;
}
