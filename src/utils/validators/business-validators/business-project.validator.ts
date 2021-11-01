import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { CustomMessages } from "src/exception/custom-messages";
import { ProfileUser } from "src/profile-user/entities/profile-user.entity";
import { ProfileUserService } from "src/profile-user/profile-user.service";
import { Project, ProjectVisibility } from "src/project/entities/project.entity";
import { ProjectService } from "src/project/project.service";
import { ArrayValidator } from "../array.validator";
import { BusinessProductBacklogValidator } from "./business-product-backlog.validator";
import { BusinessProfileUserValidator } from "./business-profile-user.validator";

export class BusinessProjectValidator {

    private readonly projectService: ProjectService;
    private readonly profileUserService: ProfileUserService;
    private readonly businessProfileUserValidator: BusinessProfileUserValidator;
    private readonly businessProductBacklogValidator: BusinessProductBacklogValidator;

    constructor(
        projectService: ProjectService,
        profileUserService: ProfileUserService,
        businessProfileUserValidator: BusinessProfileUserValidator,
        businessProductBacklogValidator: BusinessProductBacklogValidator) {
        this.projectService = projectService;
        this.profileUserService = profileUserService;
        this.businessProfileUserValidator = businessProfileUserValidator;
        this.businessProductBacklogValidator = businessProductBacklogValidator;
    }

    async validateProject(profileUserId: number, project: Project): Promise<void> {
        let profileUser = await this.profileUserService.findOne(profileUserId);
        const proyect = await this.projectService.findOneByAttributes({name:project.projectName});
        if (!!proyect) throw new BadRequestException(CustomMessages.DUPLICATED_PROJECT);
        await this.validateProjectLimit(profileUser);
        this.businessProductBacklogValidator.validateProductBacklogs(project?.productBacklogs);
        await this.validateVisibility(profileUser, project.visibility);
    }

    async validateProjectLimit(profileUser: ProfileUser): Promise<void> {
        let projects = await this.projectService.findByProfileUserId(profileUser.id);
        if (!profileUser.testUser) {
            if (projects?.length >= 5 && projects?.length < 10 && !profileUser.suscribed) {
                throw new HttpException(CustomMessages.PROFILE_USER_NOT_SUSCRIBED_TO_SAVE_PROJECTS, HttpStatus.NOT_FOUND);
            } else if (projects?.length >= 10) {
                throw new HttpException(CustomMessages.PROJECT_LIMIT_EXCEED, HttpStatus.BAD_REQUEST);
            }
        }
    }

    async validateVisibility(profileUser: ProfileUser, visibility: string): Promise<void> {
        if (visibility == ProjectVisibility.PRIVATE) {
            this.businessProfileUserValidator.validateSuscription(profileUser);
        }
    }

}