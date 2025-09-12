// Allow indexed access for process.env to ease migration from bracket access
// This is a narrow relaxation and does not change runtime behavior.
declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}
