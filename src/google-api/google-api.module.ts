import { Module } from '@nestjs/common';
import { GoogleApiService } from './google-api.service';
import { GoogleApiController } from './google-api.controller';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { GoogleAuthProvider } from './google-auth/google-auth.provider';

@Module({
  controllers: [GoogleApiController],
  providers: [GoogleApiService,GoogleAuthProvider],
  imports: [GoogleAuthModule]
})
export class GoogleApiModule {



}
