import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
//import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';
@Module({
  imports: [

    ConfigModule.forRoot(),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ AuthModule ],
      inject: [ JwtService ],
      useFactory: async( jwtService: JwtService ) => ({
        playground: false,
        autoSchemaFile: join( process.cwd(), 'src/schema.gql'), 
        plugins: [
          ApolloServerPluginLandingPageLocalDefault()
        ],
        context({ req }) {
          
          //   const token = req.headers.authorization?.replace('Bearer ','');
          //  if ( !token ) throw Error('Token needed');

            // const payload = jwtService.decode( token );
            // console.log(payload)
            // if ( !payload ) throw Error('Token not valid');
          
        }
      })
    }),

    /*
    GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    // debug: false,
    playground: false,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // context({ req }) {
    //   // const token = req.headers.authorization?.replace('Bearer ','');
    //   // if ( !token ) throw Error('Token needed');

    //   // const payload = JwtService.arguments(token);
    //   // if ( !payload ) throw Error('Token not valid');
      
    // }
  }),
  */

  TypeOrmModule.forRoot({
    type: 'postgres',
    //#Configuracion cuando la BD requiere conexion SSL
    // ssl: (process.env.STATE === 'prod') ?
    //   {
    //     rejectUnauthorized: false,
    //     sslmode: 'require'
    //   }
    //   : false as any,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    autoLoadEntities: true,
    schema: 'anylist', // Aquí defines el nombre del esquema que deseas utilizar
  } as TypeOrmModuleOptions), 
  ItemsModule, UsersModule, AuthModule, SeedModule, CommonModule, ListsModule,

  ListItemModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor() {
    console.log("host", process.env.DB_HOST);
  }
}
