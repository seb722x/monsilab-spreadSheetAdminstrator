import { Module } from '@nestjs/common';
import { GoogleAuthProvider } from './google-auth.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [GoogleAuthProvider],
  imports: [
    
  ],
  exports: [
    GoogleAuthProvider,
  ]
  
})
export class GoogleAuthModule {}
