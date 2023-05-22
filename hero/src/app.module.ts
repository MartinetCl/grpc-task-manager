import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { grpcConfig } from './grpc.config';

@Module({
  imports: [GrpcReflectionModule.register(grpcConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
