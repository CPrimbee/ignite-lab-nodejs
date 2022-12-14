import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpModule {
  getHello(): string {
    return 'Hello World!';
  }
}
