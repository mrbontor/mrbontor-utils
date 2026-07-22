import type {
  MaskRule,
  GlobalOptions,
  StrategyFunction,
  MatcherType,
} from "./types";
import {
  maskSlice,
  maskEmail,
  maskPhone,
  maskIP,
  maskCard,
} from "./strategies";

export class DataMasker {
  private static customStrategies = new Map<string, StrategyFunction>();

  public static registerStrategy(name: string, fn: StrategyFunction): void {
    if (typeof fn !== "function") {
      throw new Error(`Strategy '${name}' must be a function.`);
    }
    this.customStrategies.set(name, fn);
  }

  public static mask<T>(
    data: T,
    rules: MaskRule[] = [],
    globalOptions: GlobalOptions = { maskChar: "*" },
  ): T {
    if (!data || typeof data !== "object") return data;

    if (Array.isArray(data)) {
      return data.map((item) =>
        this.mask(item, rules, globalOptions),
      ) as unknown as T;
    }

    const result: Record<string, unknown> = {
      ...(data as Record<string, unknown>),
    };

    for (const key of Object.keys(result)) {
      const value = result[key];

      if (value && typeof value === "object") {
        result[key] = this.mask(value, rules, globalOptions);
        continue;
      }

      const matchedRule = rules.find((rule) =>
        this._matchKey(key, value, rule.match),
      );

      if (matchedRule) {
        const strValue = String(value);
        const config = {
          maskChar: globalOptions.maskChar,
          ...matchedRule.options,
        };
        const { strategy } = matchedRule;

        if (typeof strategy === "function") {
          result[key] = strategy(strValue, config);
        } else if (
          typeof strategy === "string" &&
          this.customStrategies.has(strategy)
        ) {
          const customFn = this.customStrategies.get(strategy)!;
          result[key] = customFn(strValue, config);
        } else if (strategy === "email") {
          result[key] = maskEmail(strValue, config);
        } else if (strategy === "phone") {
          result[key] = maskPhone(strValue, config);
        } else if (strategy === "ip") {
          result[key] = maskIP(strValue, config);
        } else if (strategy === "card") {
          result[key] = maskCard(strValue, config);
        } else {
          result[key] = maskSlice(strValue, config);
        }
      }
    }

    return result as T;
  }

  private static _matchKey(
    key: string,
    value: unknown,
    matcher: MatcherType,
  ): boolean {
    if (typeof matcher === "string") return key === matcher;
    if (matcher instanceof RegExp) return matcher.test(key);
    if (typeof matcher === "function") return matcher(key, value);
    return false;
  }
}
