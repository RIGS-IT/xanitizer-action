import * as core from '@actions/core';

import * as installer from './install-xanitizer';
import * as xan from './run-xanitizer';

async function run() {
	try {
		// get latest version
		const latestVersion: installer.DownloadLink = await installer.getLatestVersionUrl();
		// download and install tool
		const installDir = await installer.downloadAndInstall(latestVersion.version, latestVersion.uriPart);
		// run tool
		await xan.run(installDir, latestVersion.version);
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();