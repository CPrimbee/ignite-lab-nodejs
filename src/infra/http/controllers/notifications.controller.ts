import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SendNotification } from '@application/use-cases/send-notification';
import { CreateNotificationBody } from '../dtos/create-notification-body';
import {
  NotificationViewModel,
  NotificationViewModelBody,
} from '../view-models/notification-view-model';
import { CancelNotification } from '@application/use-cases/cancel-notification';
import { ReadNotification } from '@application/use-cases/read-notification';
import { UnreadNotification } from '@application/use-cases/unread-notification';
import { CountRecipientNotifications } from '@application/use-cases/count-recipient-notifications';
import { GetRecipientNotifications } from '@application/use-cases/get-recipient-notifications';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
@ApiExtraModels(NotificationViewModelBody)
export class NotificationsController {
  constructor(
    private sendNotification: SendNotification,
    private cancelNotification: CancelNotification,
    private readNotification: ReadNotification,
    private unreadNotification: UnreadNotification,
    private countRecipientNotifications: CountRecipientNotifications,
    private getRecipientNotifications: GetRecipientNotifications,
  ) {}

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an notification by id' })
  @ApiParam({
    name: 'id',
    description: 'Notification id',
    example: '5307f9c0-1958-49ea-9ac7-297f7ee8191b',
  })
  @ApiOkResponse({ description: 'OK' })
  async cancel(@Param('id') id: string) {
    await this.cancelNotification.execute({ notificationId: id });
  }

  @Get('count/from/:recipientId')
  @ApiOperation({ summary: 'Count all recipient notifications' })
  @ApiParam({
    name: 'recipientId',
    description: 'Recipient id',
    example: '30e9a347-fbcb-448d-adf0-d92475b9073b',
  })
  @ApiOkResponse({
    description: 'OK',
    schema: {
      properties: {
        count: {
          type: 'number',
          example: '7',
        },
      },
    },
  })
  async countFromRecipient(@Param('recipientId') recipientId: string) {
    const { count } = await this.countRecipientNotifications.execute({
      recipientId,
    });

    return {
      count,
    };
  }

  @Get('from/:recipientId')
  @ApiOperation({ summary: 'Get all recipient notifications' })
  @ApiParam({
    name: 'recipientId',
    description: 'Recipient id',
    example: '30e9a347-fbcb-448d-adf0-d92475b9073b',
  })
  @ApiOkResponse({
    description: 'OK',
    schema: {
      properties: {
        notifications: {
          type: 'array',
          items: {
            $ref: getSchemaPath(NotificationViewModelBody),
          },
        },
      },
    },
  })
  async getFromRecipient(@Param('recipientId') recipientId: string) {
    const { notifications } = await this.getRecipientNotifications.execute({
      recipientId,
    });

    return {
      notifications: notifications.map(NotificationViewModel.toHTTP),
    };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Set a notification as read' })
  @ApiParam({
    name: 'notificationId',
    description: 'Notification id',
    example: '5307f9c0-1958-49ea-9ac7-297f7ee8191b',
  })
  @ApiOkResponse({ description: 'OK' })
  async read(@Param('id') id: string) {
    await this.readNotification.execute({ notificationId: id });
  }

  @Patch(':id/unread')
  @ApiOperation({ summary: 'Set a notification as unread' })
  @ApiParam({
    name: 'notificationId',
    description: 'Notification id',
    example: '5307f9c0-1958-49ea-9ac7-297f7ee8191b',
  })
  @ApiOkResponse({ description: 'OK' })
  async unread(@Param('id') id: string) {
    await this.unreadNotification.execute({ notificationId: id });
  }

  @Post()
  @ApiOperation({ summary: 'Set a notification as unread' })
  @ApiBody({ type: CreateNotificationBody })
  @ApiCreatedResponse({
    description: 'Created',
    schema: {
      properties: {
        notification: {
          $ref: getSchemaPath(NotificationViewModelBody),
        },
      },
    },
  })
  async create(@Body() body: CreateNotificationBody) {
    const { recipientId, content, category } = body;

    const { notification } = await this.sendNotification.execute({
      recipientId,
      content,
      category,
    });

    return { notification: NotificationViewModel.toHTTP(notification) };
  }
}
