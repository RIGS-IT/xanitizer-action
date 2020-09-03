import * as core from '@actions/core';

import * as path from 'path';
import * as fs from 'fs';

import { GitHubParameters } from '../headless-util/github-parameters';

export class InstallLicenseFileCmd {

	private readonly licenseFileInput: string;

	constructor(private readonly homeDir: string) {
		this.licenseFileInput = core.getInput(GitHubParameters.LICENSE, { required: false });
	}

	protected shortName(): string {
		return "Install Xanitizer license";
	}

	protected canExecuted(): boolean {
		return this.licenseFileInput != null && this.licenseFileInput.length > 0;
	}

	public async run() {
		if (this.canExecuted() === false) {
			return;
		}

		core.info(`${this.shortName()}`);

		if (this.licenseFileInput != null && this.licenseFileInput.length > 0) {
			this.installLicenseFile();
		}
	}

	private installLicenseFile() {
		const xanPath: string = this.homeDir + path.sep + ".Xanitizer";

		if (fs.existsSync(xanPath) == false) {
			fs.mkdirSync(xanPath, { recursive: true, mode: 0o700 });
		}

		const licenseFile: string = xanPath + path.sep + 'Xanitizer.license';

		fs.writeFileSync(licenseFile, this.licenseFileInput, { encoding: "utf8" });
	}
}