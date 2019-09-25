export const stripVersions = (url: string): string => {
    if (url.endsWith("/ocpi/versions")) {
        return url.replace("/ocpi/versions", "")
    }
    return url
}
