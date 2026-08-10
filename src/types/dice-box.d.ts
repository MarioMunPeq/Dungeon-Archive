/**
 * Minimal ambient types for @3d-dice/dice-box (v1.x). The package ships no
 * bundled types; only the API surface used by the lazy Dice Roller stage is
 * declared here.
 */
declare module "@3d-dice/dice-box" {
  export interface DiceBoxDieResult {
    readonly value: number;
    readonly sides: number;
    readonly dieType?: string;
    readonly groupId?: string;
    readonly rollId?: number;
    readonly theme?: string;
    readonly themeColor?: string;
  }

  export interface DiceBoxGroupResult {
    readonly value: number;
    readonly qty: number;
    readonly modifier: number;
    readonly rolls: readonly DiceBoxDieResult[];
  }

  export interface DiceBoxConfig {
    readonly id?: string;
    readonly container?: string;
    readonly assetPath?: string;
    readonly theme?: string;
    readonly preloadThemes?: readonly string[];
    readonly externalThemes?: Readonly<Record<string, string>>;
    readonly themeColor?: string;
    readonly offscreen?: boolean;
    readonly scale?: number;
    readonly lightIntensity?: number;
    readonly enableShadows?: boolean;
    readonly shadowTransparency?: number;
    readonly delay?: number;
    readonly origin?: string;
    readonly suspendSimulation?: boolean;
    readonly onBeforeRoll?: (notations: readonly unknown[]) => void;
    readonly onDieComplete?: (die: DiceBoxDieResult) => void;
    readonly onRollComplete?: (results: readonly DiceBoxGroupResult[]) => void;
    readonly onRemoveComplete?: (die: DiceBoxDieResult) => void;
    readonly onThemeConfigLoaded?: (theme: unknown) => void;
    readonly onThemeLoaded?: (theme: unknown) => void;
  }

  export interface DiceBoxRollOptions {
    readonly theme?: string;
    readonly themeColor?: string;
    readonly newStartPoint?: boolean;
  }

  export default class DiceBox {
    constructor(config: DiceBoxConfig);
    readonly config: DiceBoxConfig;
    readonly canvas: HTMLCanvasElement;
    init(): Promise<this>;
    roll(
      notation: string | readonly string[],
      options?: DiceBoxRollOptions,
    ): Promise<readonly DiceBoxDieResult[]>;
    add(
      notation: string | readonly string[],
      options?: DiceBoxRollOptions,
    ): Promise<readonly DiceBoxDieResult[]>;
    clear(): this;
    updateConfig(options: Partial<DiceBoxConfig>): Promise<this>;
    onBeforeRoll: (notations: readonly unknown[]) => void;
    onDieComplete: (die: DiceBoxDieResult) => void;
    onRollComplete: (results: readonly DiceBoxGroupResult[]) => void;
    onRemoveComplete: (die: DiceBoxDieResult) => void;
    onThemeConfigLoaded: (theme: unknown) => void;
    onThemeLoaded: (theme: unknown) => void;
  }
}
