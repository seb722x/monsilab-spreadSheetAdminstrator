import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleSpreadsheet, ServiceAccountCredentials } from 'google-spreadsheet';



@Injectable()
export class GoogleAuthProvider {

    constructor(private configService: ConfigService) {}

    async getCredentials() {
        const credentials =   this.configService.get<ServiceAccountCredentials>('credentials');
        return  credentials
      }

    async useAccountAuth(spreedsheet:GoogleSpreadsheet){
        const credentials = await this.getCredentials();
        await spreedsheet.useServiceAccountAuth( credentials);   
        return spreedsheet;

    }  

}


