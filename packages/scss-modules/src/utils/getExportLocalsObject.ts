/**
 * Copyright (c) 2022 - KM
 */

export function getExportLocalsObject(src: string): string {
    const fullExportLocals = RegExp(/___CSS_LOADER_EXPORT___\.locals\s=\s\{[\w\W\s\S]*\};/g).exec(src);
    if (fullExportLocals == null || fullExportLocals?.length === 0) {
        throw new Error("Could not identify a exports local from the processed scss modules file.");
    }

    const exportObject = RegExp(/\{[\w\W\s\S]*\}/).exec(fullExportLocals[0]);
    if (exportObject == null || exportObject?.length === 0) {
        throw new Error("Could not identify a complete object from the export locals string.");
    }

    return exportObject[0];
}
