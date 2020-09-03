import * as core from '@actions/core';

import { AbstractCmdForProject } from './abstract-cmd-for-project';
import { CmdLineUtil } from '../headless-util/commandline-util';
import { HeadlessParameters } from '../headless-util/headless-parameters';

export class ExportProjectCmd extends AbstractCmdForProject {

	private readonly exportDirectory: string;
	private readonly exportSnapshots: boolean;
	private readonly exportPassphrase: string;

	constructor(installDir: string, githubCheckoutPath: string, githubProjectName: string) {
		super(installDir, githubCheckoutPath, githubProjectName);

		this.exportDirectory = core.getInput(HeadlessParameters.EXPORT_DIRECTORY, { required: false });
		this.exportSnapshots = this.getBooleanParameter(
			core.getInput(HeadlessParameters.EXPORT_DIRECTORY, { required: false }), false);
		this.exportPassphrase = core.getInput(HeadlessParameters.EXPORT_PASSPHRASE, { required: false });
	}

	protected shortName(): string {
		return "Export project";
	}

	protected canExecuted(): boolean {
		return this.exportDirectory != null && this.exportDirectory.length > 0;
	}

	protected buildCommandLines(): string[][] {

		const ret: string[][] = [];

		ret.push(CmdLineUtil.mkCommandLineForExportProject(this.installDir, this.logLevel, this.licenseServerRetryCount,

			this.proxyServer, this.proxyPort, this.proxyUser, this.proxyPassword,

			this.configFile, this.projectDataDirectory,

			this.projectName, this.configFileDirectory, this.rootDirectory,

			this.exportDirectory, this.exportSnapshots, this.exportPassphrase));

		return ret;
	}
}