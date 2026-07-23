export interface MaskOptions {
  maskChar?: string;
  showStart?: number;
  showEnd?: number;
  preserveFormat?: boolean;
}

export type StrategyFunction = (value: string, options: MaskOptions) => string;

export type MatcherFunction = (key: string, value: unknown) => boolean;

export type MatcherType = string | RegExp | MatcherFunction;

export type BuiltInStrategy = "slice" | "email" | "phone" | "ip" | "card";

export type StrategyType = BuiltInStrategy | string | StrategyFunction;

export interface MaskRule {
  match: MatcherType;
  strategy: StrategyType;
  options?: MaskOptions;
}

export type GlobalOptions = MaskOptions;
