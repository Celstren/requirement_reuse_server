import { HttpException, HttpStatus } from "@nestjs/common";
import { CustomMessages } from "src/exception/custom-messages";
import { ProfileUser } from "src/profile-user/entities/profile-user.entity";
import { ProfileUserService } from "src/profile-user/profile-user.service";
import { Project } from "src/project/entities/project.entity";
import { ArrayValidator } from "../array.validator";
import {createConnection, Connection} from "typeorm";
import { CommonValidator } from "../common.validator";

export class BusinessProfileUserValidator {

  private readonly profileUserService: ProfileUserService;

  constructor(profileUserService: ProfileUserService) {
    this.profileUserService = profileUserService;
  }

  getUniqueKey(profileUser: ProfileUser): string { 
    return profileUser?.email;
  }

  validateSuscription(profileUser: ProfileUser): void {
    if (profileUser.suscribed === undefined) {
        throw new HttpException(CustomMessages.PROFILE_USER_SUSCRIBED_NULL, HttpStatus.BAD_REQUEST);
    } else if (!profileUser.suscribed) {
        throw new HttpException(CustomMessages.PROFILE_USER_NOT_SUSCRIBED_TO_SAVE_EMPLOYEES, HttpStatus.BAD_REQUEST);
    }
  }

  async validateEmployees(profileUserId: number, project: Project): Promise<void> {
    let hasEmployees = ArrayValidator.isNotEmpty(project?.employees);
    if (hasEmployees) {
      let addedEmployeeEmails = project.employees.map<string>(employee => this.getUniqueKey(employee));
      let profileUser = await this.profileUserService.findOne(profileUserId);
      this.validateSuscription(profileUser);
      project.employees?.forEach(
        employee => {
          let key = this.getUniqueKey(employee);
          if (key && addedEmployeeEmails.indexOf(key) == -1) {
            addedEmployeeEmails.push();
          }
        }
      );
      if (addedEmployeeEmails.length > 5) {
        throw new HttpException(CustomMessages.EMPLOYEES_LIMIT_EXCEED, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async validateUpdatedEmployees(profileUserId: number, project: Project): Promise<void> {
    let hasEmployees = ArrayValidator.isNotEmpty(project?.employees);
    if (hasEmployees) {
      let profileUser = await this.profileUserService.findOne(profileUserId);
      this.validateSuscription(profileUser);
      const connection: Connection = await createConnection();
      let currentProject = await connection.getRepository(Project).findOne({
          where: {
              id: project.id,
          }
      });
      CommonValidator.validateObjectFound(currentProject, CustomMessages.PROJECT_NOT_FOUND);
      let uniqueKeys: Map<string, number> = new Map<string, number>();
      let duplicated = [];
      project.employees?.forEach(
        employee => {
          uniqueKeys[this.getUniqueKey(employee)] ??= 1;
        }
      );
      currentProject.employees.forEach(
        (employee, index) => {
            if (uniqueKeys[this.getUniqueKey(employee)]) {
                duplicated.push(index.toString());
            } else {
                uniqueKeys[this.getUniqueKey(employee)] = 1;
            }
            uniqueKeys[this.getUniqueKey(employee)]++;
        }
      );
      if (uniqueKeys.size > 5) {
        throw new HttpException(CustomMessages.EMPLOYEES_LIMIT_EXCEED, HttpStatus.BAD_REQUEST);
      } else if (ArrayValidator.isNotEmpty(duplicated)) {
        throw new HttpException(CustomMessages.DUPLICATED_EMPLOYEES + ': ' + duplicated.join(','), HttpStatus.BAD_REQUEST);
      }
    }
  }

}