import * as core from '@actions/core';
import * as http from '@actions/http-client';
import * as tc from '@actions/tool-cache';

const ROOT_URL: string = "https://www.xanitizer.com/opendownloads";
const LATEST_VERSION_JSON_URL: string = `${ROOT_URL}/Xanitizer-latest-release/version.json`;

/** Content of the version.json file. */
export interface DownloadLink {
	version: string,
	uriPart: string
}

export async function getLatestVersionUrl(): Promise<DownloadLink> {
	const httpClient: http.HttpClient = new http.HttpClient('github-xanitizer-action-installer', undefined, {
		allowRetries: true,
		maxRetries: 3
	});

	const response = await httpClient.get(LATEST_VERSION_JSON_URL);

	const statusCode = response.message.statusCode || 0;
	if (statusCode < 200 || statusCode > 299) {
		let body = '';
		try {
			body = await response.readBody();
		} catch (err) {
			core.debug(`Unable to read body: ${err.message}`);
		}
		const message = `Unexpected HTTP status code '${response.message.statusCode}' when retrieving versions.${body} `.trim();
		throw new Error(message);
	}

	const body: string = await response.readBody()

	const link: DownloadLink = JSON.parse(body);

	core.info(`Latest version of Xanitizer is ${link.version} `);

	return link;
}

export async function downloadAndInstall(version: string, uriPart: string): Promise<string> {

	const toolName = "Xanitizer";
	const arch: string = "x64";

	// look for cached installations
	{
		const cachedDir: string = tc.find(toolName, version, arch);
		if (cachedDir != null && cachedDir.length > 0) {
			core.info(`Using preinstalled/cached Xanitizer at ${cachedDir}.`);

			return cachedDir;
		}
	}

	// download and install
	let os: string;
	switch (process.platform) {
		case 'linux': os = 'lin64'; break;
		case 'win32': os = 'win64'; break;
		// No headless mode for macOS supported.
		// case 'darwin': os = 'mac64'; break;
		default: throw new Error(`Unsupported operating system to run Xanitizer '${process.platform}'.`);
	}

	const url: string = `${ROOT_URL}/${uriPart}/Xanitizer-${version}-${os}.zip`;

	core.info(`Download version ${version} from ${url}.`);

	const downloadDir: string = await tc.downloadTool(url);
	if (downloadDir == null) {
		throw new Error(`Unable to download Xanitizer from ${url}.`);
	}

	const installDir: string = await tc.extractZip(downloadDir);
	if (installDir == null) {
		throw new Error("Unable to extract Xanitizer.");
	}

	core.info(`Xanitizer was successfully installed to ${installDir}.`);

	// cache installation
	{
		const cachedDir: string = await tc.cacheDir(installDir, toolName, version, arch);
		if (cachedDir == null) {
			core.warning("Unable to cache Xanitizer. Use installed directory.");
			return installDir
		}

		core.info(`Xanitizer was successfully installed/cached to ${cachedDir}.`);

		return cachedDir;
	}
}