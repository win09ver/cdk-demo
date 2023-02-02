import { AuthService } from "./AuthService";
import { config } from "./config";

const authService = new AuthService

const user = authService.login(config.USER_NAME, config.TEST_USER_PASSWORD)

console.log("user", user)