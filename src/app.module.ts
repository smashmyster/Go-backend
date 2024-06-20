import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './app/logic/user/user.controller';
import { UserService } from './app/logic/user/user.service';
import { UserModule } from './app/logic/user/user.module';
import { CustomNamingStrategy } from './utils/NamingStrategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenderController } from './app/logic/gender/gender.controller';
import { GenderService } from './app/logic/gender/gender.service';
import { GenderModule } from './app/logic/gender/gender.module';
import { AuthController } from './app/logic/auth/auth.controller';
import { AuthService } from './app/logic/auth/auth.service';
import { AuthModule } from './app/logic/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { RequestsController } from './app/logic/requests/requests.controller';
import { RequestsService } from './app/logic/requests/requests.service';
import { RequestsModule } from './app/logic/requests/requests.module';
import { ChatController } from './app/logic/chat/chat.controller';
import { ChatService } from './app/logic/chat/chat.service';
import { ChatModule } from './app/logic/chat/chat.module';
import { Gateway } from './app/logic/gateway/gateway';
import { GatewayModule } from './app/logic/gateway/gateway.module';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionsController } from './app/logic/subscriptions/subscriptions.controller';
import { SubscriptionsService } from './app/logic/subscriptions/subscriptions.service';
import { SubscriptionsModule } from './app/logic/subscriptions/subscriptions.module';
import { NotificationsController } from './app/logic/notifications/notifications.controller';
import { NotificationsService } from './app/logic/notifications/notifications.service';
import { NotificationsModule } from './app/logic/notifications/notifications.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.databaseUsername,
      password: process.env.databasePassword,
      database: process.env.database,
      synchronize: false,
      logging: true,
      entities: ['dist/src/app/entities/*{.ts,.js}'],
      namingStrategy: new CustomNamingStrategy(),
    }),
    MulterModule.register({
      dest: `${process.env.imagePath}`,
    }),
    UserModule,
    GenderModule,
    AuthModule,
    RequestsModule,
    ChatModule,
    GatewayModule,
    SubscriptionsModule,
    NotificationsModule,
  ],
  controllers: [
    AppController,
    UserController,
    GenderController,
    AuthController,
    RequestsController,
    ChatController,
    SubscriptionsController,
    NotificationsController,
  ],
  providers: [
    AppService,
    UserService,
    GenderService,
    AuthService,
    JwtService,
    RequestsService,
    ChatService,
    Gateway,
    SubscriptionsService,
    NotificationsService,
  ],
})
export class AppModule {}
