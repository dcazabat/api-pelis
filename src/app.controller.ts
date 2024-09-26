import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { Response } from 'express';

@ApiTags('App Patitas')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  Welcome(@Res() res: Response) {
    const htmlFilePath = join(__dirname, '..', 'html', 'index.html');
    return res.sendFile(htmlFilePath);
  }

  @Get('/test')
  getHello(): string {
    return this.appService.getHello();
  }
}
