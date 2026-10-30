/** Public display targets, not a release manifest. No installer URL is configured. */
export const downloadPlatforms = ["macos", "windows"] as const;
export type DownloadPlatform = typeof downloadPlatforms[number];
export const downloadIconPresets = ["laptop", "desktop", "windows"] as const;
export type DownloadIconPreset = typeof downloadIconPresets[number];
/** Only a separately reviewed code change may enable official installer delivery. */
export const installerAvailability = { macos: "comingSoon", windows: "comingSoon" } as const;
