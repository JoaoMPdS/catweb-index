import { Schema } from "../../json-schema/schema";

export type ParsedUrl = {
    hostname: string,
    path: string,
    resolvedUrl: string,
    subdomain: string,
}

export function parseUrl(url: string): ParsedUrl {
    const [domainPart, ...pathParts] = url.split('/');
    const path = pathParts.length ? '/' + pathParts.join('/') : '/';

    const domainSegments = domainPart.split('.');
    const tld = 'rbx';

    let hostname = '';
    let subdomain = '';

    if (domainSegments.length >= 2 && domainSegments[domainSegments.length - 1] === tld) {
        hostname = domainSegments[domainSegments.length - 2];
        subdomain = domainSegments.slice(0, -2).join('.');
    } else if (domainSegments.length >= 2) {
        hostname = domainSegments[domainSegments.length - 1];
        subdomain = domainSegments.slice(0, -1).join('.');
    } else if (domainSegments.length === 1 && domainSegments[0] !== tld) {
        hostname = domainSegments[0];
    }

    let resolvedUrl = `${subdomain ? subdomain + '.' : ''}${hostname}.rbx${path}`;
    if (resolvedUrl.endsWith("/")) resolvedUrl = resolvedUrl.slice(0, -1)

    return { path, hostname, subdomain, resolvedUrl };
}

export function getPathData(url: ParsedUrl, data: Schema) {
    const subdomainData = data.subdomains[url.subdomain || ""] || [];
    const matchingPaths = subdomainData.filter(entry => url.path.startsWith(entry.path));
    
    matchingPaths.sort((a, b) => b.path.length - a.path.length);

    return matchingPaths.length > 0 ? matchingPaths[0] : null;
}