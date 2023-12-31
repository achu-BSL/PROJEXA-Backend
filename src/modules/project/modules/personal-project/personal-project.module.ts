import { Module } from '@nestjs/common';
import { PersonalProjectController } from './personal-project.controller';
import { PersonalProjectService } from './personal-project.service';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { ProjectStageModule } from './modules/personal-project-stage/personal-project-stage.module';

@Module({
  imports: [PrismaModule, ProjectStageModule],
  controllers: [PersonalProjectController],
  providers: [PersonalProjectService],
})
export class PersonalProjectModule {}
