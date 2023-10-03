import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { MailModule } from "../mail/mail.module";
import { RedisModule } from "../redis/redis.module";
import { AuthModule } from "../auth/auth.module";
import { OtpModule } from "../otp/otp.module";

@Module({
    imports: [PrismaModule, MailModule, RedisModule, AuthModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}