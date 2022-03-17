// Enables `printDebug` messages and operation timers.
export const DEBUG: boolean = true;

// What character(s) to use to define the beginning of custom commands.
export const COMMAND_PREFIX: string = ';';

// How many operations can be recorded in a player's history.
export const MAX_HISTORY_SIZE: number = 20;

// Whether a player's selection is drawn by default.
export const DRAW_SELECTION: boolean = true;

// 0 - DISABLED    - Undo and redo will be disabled.
// 1 - FAST     - The cuboid region of each operation will be recorded.
// 2 - ACCURATE    - Individual blocks in each operation will be recorded.
export const HISTORY_MODE: 0|1|2 = 2; // How to handle general undo and redo
export const BRUSH_HISTORY_MODE: 0|1|2 = 1; // How to handle brush undo and redo

// How long until a previously active builder's session gets deleted.
// This includes their undo redo history.
export const TICKS_TO_DELETE_SESSION: number = 12000; // 10 minutes

// Whether commands executed by items print their messages to the action bar or the chat.
export const PRINT_TO_ACTION_BAR: boolean = true;

// The default item used for marking selection wand.
export const WAND_ITEM: string = 'minecraft:wooden_axe';

// The default item used for the navigation wand.
export const NAV_WAND_ITEM: string = 'minecraft:ender_pearl';

// THe distance the navwand, among other tools and commands, traces for a block of interest.
export const NAV_WAND_DISTANCE: number = 50;

// The maximum brush radius.
export const MAX_BRUSH_RADIUS: number = 6;

// The version of WorldEdit (do not change)
export const VERSION: string = '0.5.4 [beta]';