export { DataMasker } from "./masker";
export {
  maskSlice,
  maskEmail,
  maskPhone,
  maskIP,
  maskCard,
} from "./strategies";
export type {
  MaskOptions,
  MaskRule,
  GlobalOptions,
  StrategyFunction,
  MatcherFunction,
  MatcherType,
} from "./types";
