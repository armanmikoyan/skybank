import authService from "../services/authService";

export const mongoMonitoring = () => {
   const day = 1 * 24 * 60 * 60 * 1000; // 1 day 
   setInterval(authService.deleteExiredRefreshTokens, day);
   setInterval(authService.deleteInactiveUsers, day);
   setInterval(authService.deleteExpiredVerificationCodes, day);
};


