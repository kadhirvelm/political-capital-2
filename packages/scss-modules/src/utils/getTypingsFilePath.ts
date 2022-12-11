/**
 * Copyright (c) 2022 - KM
 */

import * as path from "path";
import { getOptions } from "loader-utils";
import * as webpack from "webpack";

export function getTypingsFilePath(this: webpack.LoaderContext<{}>) {
    const options = getOptions(this);

    const srcPath =
        options.namespace === undefined
            ? this.resourcePath.match(/.*\/packages\/[\w\-_@]*\//g)
            : RegExp(`.*\\/packages\\/${options.namespace as string}\\/[\\w\\-_@]*\\/`).exec(this.resourcePath);

    if (srcPath == null || srcPath?.length === 0) {
        throw new Error("Could not identify where the src path is.");
    }

    const sourcePath = path.dirname(this.resourcePath).match(/\/src.*/g)?.[0];

    const removeSrcFromPath = (filePath: string | undefined) =>
        filePath === undefined ? "" : filePath.split("/").slice(2).join("/");

    return {
        path: path.join(srcPath[0], "compiled_types", removeSrcFromPath(sourcePath) ?? ""),
        sourcePath,
        file: path.basename(this.resourcePath),
    };
}
