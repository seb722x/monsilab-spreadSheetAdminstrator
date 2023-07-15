import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';

import { AuthService } from './auth.service';
//import {  Auth } from './decorators';

import { CreateUserDto, LoginUserDto } from './dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto ) {
    return this.authService.create( createUserDto );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }



}

























//@Get('private')
//@UseGuards( AuthGuard() )
//testingPrivateRoute(
//  @Req() request: Express.Request,
//  @GetUser() user: User,
//  @GetUser('email') userEmail: string,
//  
//  @RawHeaders() rawHeaders: string[],
//  @Headers() headers: IncomingHttpHeaders,
//) {
//  return {
//    ok: true,
//    message: 'Hola Mundo Private',
//    user,
//    userEmail,
//    rawHeaders,
//    headers
//  }
//}
//// @SetMetadata('roles', ['admin','super-user'])
//@Get('private2')
//@RoleProtected( ValidRoles.superUser, ValidRoles.admin )
//@UseGuards( AuthGuard(), UserRoleGuard )
//privateRoute2(
//  @GetUser() user: User
//) {
//  return {
//    ok: true,
//    user
//  }
//}