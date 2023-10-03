import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
import { AuthService } from '../auth/auth.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginUerDto } from '../user/dto/login-user.dto';

@Injectable()
export class OtpService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly authService: AuthService,
  ) {}

  async generateAndMailOTP (user_email: string) {
    const OTP = await this.mailService.sendOTP(user_email);
    this.redisService.setItem(`${user_email}-OTP`, OTP);
    return "OTP Sended successfully";
  }

  /**
   * Generate Register OTP Service.
   * @param res - Response object
   * @param registerUserDto - User credantial.
   * @returns 
   */
  async generateRegisterOTP(res: Response, registerUserDto: RegisterUserDto) {
    try {
      const { user_email, user_name } = registerUserDto;
      await this.userService.isExist(user_name, user_email);
      await this.generateAndMailOTP(user_email);
      res.cookie(
        'registerToken',
        await this.authService.generateRegisterToken(registerUserDto),
      );
      return 'Ok';
    } catch (err) { 
        throw new BadRequestException(err.message);
    }
  }

  async validateRegisterOTP (otp: string, user_email: string) {
    const OTP = await this.redisService.getItem(`${user_email}-OTP`);
    if(!OTP) throw new BadRequestException("OTP Expired");
    if(OTP !== otp) throw new BadRequestException("Invalid OTP");
  }


  async login (res: Response, loginUserDto: LoginUerDto) {
    const { two_factor_enabled } = await this.userService.login(res, loginUserDto);
    if(!two_factor_enabled) return "Login successfylly";
    await this.generateAndMailOTP(loginUserDto.user_email);
    res.status(201);
    return "OTP Send successfully";
  }
}
