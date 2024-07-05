export const environment = process.env.NODE_ENV;
export const AppDefaultEmail = 'GhostCloud <auth.ghostcloud.app>';
export const frontEndUrl = 'http://localhost:4321';
export const groupCampainEmailService = 'ghost-cloud';
export const tokenCampainEmailService = process.env.TOKEN_MAIL_CAMPAIN;

export const userRoles = {
  Admin: {
    id: 1,
    name: 'admin',
  },
  User: {
    id: 2,
    name: 'user',
  },
};
