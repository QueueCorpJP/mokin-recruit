// Centralized list of protected paths under /company
// Imported by CompanyLayoutClient to guard authenticated routes

export const protectedPaths: ReadonlyArray<string> = [
  '/company/mypage',
  '/company/task',
  '/company/message',
  '/company/job',
];
