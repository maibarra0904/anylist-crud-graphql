import {PassportModule} from '@nestjs/passport'
import {JwtModule} from '@nestjs/jwt'
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get('JWT_SECRET'))
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '4h'
          }
        }

      }
    })
  ],
  exports: [JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
