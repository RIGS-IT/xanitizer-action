import * as core from '@actions/core';

import { AbstractCmdForProject } from './abstract-cmd-for-project';
import { CmdLineUtil } from '../headless-util/commandline-util';
import { HeadlessParameters } from '../headless-util/headless-parameters';

export class CreateSnapshotCmd extends AbstractCmdForProject {

	private readonly createSnapshot: boolean;
	private readonly snapshotComment: string;

	constructor(installDir: string, githubCheckoutPath: string, githubProjectName: string) {
		super(installDir, githubCheckoutPath, githubProjectName);

		this.createSnapshot = this.getBooleanParameter(
			core.getInput(HeadlessParameters.CREATE_SNAPSHOT, { required: false }), false);
		this.snapshotComment = core.getInput(HeadlessParameters.SNAPSHOT_COMMENT, { required: false });
	}

	protected shortName(): string {
		return "Create snapshot";
	}

	protected canExecuted(): boolean {
		return this.createSnapshot;
	}

	protected buildCommandLines(): string[][] {

		const ret: string[][] = [];

		ret.push(CmdLineUtil.mkCommandLineForSnapshot(this.installDir, this.logLevel, this.licenseServerRetryCount,

			this.proxyServer, this.proxyPort, this.proxyUser, this.proxyPassword,

			this.configFile, this.projectDataDirectory,

			this.projectName, this.configFileDirectory, this.rootDirectory,

			this.snapshotComment));

		return ret;
	}
}