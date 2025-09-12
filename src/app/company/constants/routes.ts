// Centralized list of protected paths under /company
// Imported by CompanyLayoutClient to guard authenticated routes

export const protectedPaths: ReadonlyArray<string> = [
  '/company/dashboard',
  '/company/message',
  '/company/job',
  '/company/task',
  '/company/mypage',
];
