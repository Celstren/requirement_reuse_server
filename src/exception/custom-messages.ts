export class CustomMessages {

    // PASSWORD CUSTOM MESSAGES
    static PASSWORD_INVALID: string                                         = 'Password must have at least a number, a lowercase, and an uppercase';

    // PROFILE USER CUSTOM MESSAGES
    static PROFILE_USER_NOT_EXIST: string                                   = 'Profile User id do not exist';
    static PROFILE_USER_NOT_FOUND: string                                   = 'Profile User not found';
    static PROFILE_USER_ID_EMPTY: string                                    = 'Profile User id cannot be null nor empty';
    static PROFILE_USER_SUSCRIBED_NULL: string                              = 'Cannot validate if user is suscribed since value is null';
    static PROFILE_USER_NOT_SUSCRIBED_TO_SAVE_EMPLOYEES: string             = 'Profile User not allowed to save employees from Project';
    static PROFILE_USER_NOT_SUSCRIBED_TO_CHANGE_VISIBILITY: string          = 'Profile User not allowed to change visibility of Project';
    static EMPLOYEES_LIMIT_EXCEED: string                                   = 'Cannot add more than 5 employees by project';
    static DUPLICATED_EMPLOYEES: string                                     = 'There are duplicated employees';

    // PROJECT CUSTOM MESSAGES
    static PROFILE_USER_NOT_SUSCRIBED_TO_SAVE_PROJECTS: string      = "Projects exceed the limit allowed for non-suscribed profile user";
    static PROJECT_LIMIT_EXCEED: string                             = 'Projects exceed the limit allowed';
    static PROJECT_ID_MISSING: string                               = 'Project id is missing';
    static PROJECT_NOT_FOUND: string                                = 'Project not found';
    static DUPLICATED_PROJECT: string                                = 'There is a project with that name';
    static INVALID_CREATED_FROM_VALUE: string                       = 'From value is not valid';
    static INVALID_CREATED_TO_VALUE: string                         = 'To value is not valid';
    static INVALID_PROJECT_TO_BE_EXPORTED: string                   = "Project has not an owner's requirement"

    // PRODUCT BACKLOG CUSTOM MESSAGES
    static PRODUCT_BACKLOG_ID_MISSING: string                       = 'Product Backlog id is missing';
    static PRODUCT_BACKLOG_NOT_FOUND: string                        = 'Product Backlog not found';
    static PRODUCT_BACKLOG_MINIMUM_ERROR: string                    = 'Minimal product backlogs length required is 1 by project';
    static INVALID_PRODUCT_BACKLOGS_DUE_REQUIREMENTS: string        = 'Minimal requirements length required is 5 for product backlog';
    static DUPLICATED_PRODUCT_BACKLOGS: string                      = 'There are duplicated product backlogs';

    // GENERATED PROJECT AVAILABLE CUSTOM MESSAGES
    static GENERATED_PROJECT_AVAILABLE_ID_MISSING: string                   = 'Generated Project Available id is missing';
    static GENERATED_PROJECT_AVAILABLE_NOT_FOUND: string                    = 'Generated Project Available not found';
    static GENERATED_PROJECT_AVAILABLE_INVALID_URL: string                  = 'URL of Generated Project Available is invalid';
    static GENERATED_PROJECT_AVAILABLE_INVALID_MARKET_TYPE_NAME: string     = 'URL of Generated Project Available is invalid';


    // REQUIREMENT CUSTOM MESSAGES
    static REQUIREMENT_NOT_FOUND: string                                    = 'Requirement not found';
    static REQUIREMENT_MINIMUM_ERROR: string                                = 'Minimal requirements length required is 5 by product backlog';
    static DUPLICATED_REQUIREMENTS: string                                  = 'There are duplicated requirements';

    // REQUIREMENT PRIORITY CUSTOM MESSAGES
    static DUPLICATED_REQUIREMENT_PRIORITY: string                          = 'There are duplicated requirement priorities';
    static UNDEFINED_PROFILE_USER_REQUIREMENT_PRIORITY: string              = 'Profile User Id not defined for Requirement Priority';
    static NOT_FOUND_PROFILE_USER_REQUIREMENT_PRIORITY: string              = 'Profile User Id not found for Requirement Priority';

    // GENERIC CUSTOM MESSAGES
    static GENERIC_NOT_FOUND: string                                        = 'Object not found';
    static GENERIC_NOT_NULL: string                                         = 'Object cannot be null';
    static GENERIC_INVALID_STRING: string                                   = 'String cannot be null nor empty';

    // UNKNOWN ERROR CUSTOM MESSAGES
    static UNKNOWN_ERROR: string                                            = 'Unknown Error';

    static JWT_REFRESH_TOKEN_EXPIRED:string                         = 'Refresh token has expired'

    static INVALID_REFRESH_TOKEN:string                         = 'Refresh token has expired'

    //MARKET TYPE MESSAGES

    static MARKET_TYPE_NOT_FOUND                                    = 'Market type not found';

}