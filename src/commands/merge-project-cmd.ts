import * as core from '@actions/core';

import { AbstractCmdForProject } from './abstract-cmd-for-project';
import { CmdLineUtil } from '../headless-util/commandline-util';
import { HeadlessParameters } from '../headless-util/headless-parameters';

export class MergeProjectCmd extends AbstractCmdForProject {

	private readonly mergedProject: string;
	private readonly importPassphrase: string;

	constructor(installDir: string, githubCheckoutPath: string, githubProjectName: string) {
		super(installDir, githubCheckoutPath, githubProjectName);

		this.mergedProject = core.getInput(HeadlessParameters.MERGED_PROJECT, { required: false });
		this.importPassphrase = core.getInput(HeadlessParameters.IMPORT_PASSPHRASE, { required: false });
	}

	protected shortName(): string {
		return "Merge project";
	}

	protected canExecuted(): boolean {
		return this.mergedProject != null && this.mergedProject.length > 0;
	}

	protected buildCommandLines(): string[][] {

		const ret: string[][] = [];

		ret.push(CmdLineUtil.mkCommandLineForMergeProject(this.installDir, this.logLevel, this.licenseServerRetryCount,

			this.proxyServer, this.proxyPort, this.proxyUser, this.proxyPassword,

			this.configFile, this.projectDataDirectory,

			this.projectName, this.configFileDirectory, this.rootDirectory,

			this.mergedProject, this.importPassphrase));

		return ret;
	}
}