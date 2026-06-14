import { AdminApi } from "./admin";
import { authApi } from "./auth";
import apiClient from "./client";  // ← default import
import { coursesApi } from "./course";
import { OrganizationApi } from "./organization";
import { termsApi } from "./term";
import { userApi } from "./user";
import { userProgressApi } from "./userCourseProgress";

export const API = {
    auth: new authApi(apiClient),
    courses: new coursesApi(apiClient),
    terms: new termsApi(apiClient),
    users: new userApi(apiClient),
    admin: new AdminApi(apiClient),
    userProgress: new userProgressApi(apiClient),
    organization: new OrganizationApi(apiClient)
}