declare module "jstat" {
  export const jStat: {
    beta: {
      sample(alpha: number, beta: number): number;
    };
  };
}
