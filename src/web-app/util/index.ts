
function getKeyFromPath(path: string): string {
    return path.split("/", 1)[0];
}

function getPathFromPath(path: string): string {
    const key = getKeyFromPath(path);
    return path.replace(key, "");
}

export { getKeyFromPath, getPathFromPath }
