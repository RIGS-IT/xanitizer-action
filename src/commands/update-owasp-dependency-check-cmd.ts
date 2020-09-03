import * as core from '@actions/core';

import { AbstractCmd } from './abstract-cmd';
import { CmdLineUtil } from '../headless-util/commandline-util';
import { HeadlessParameters } from '../headless-util/headless-parameters';

export class UpdateOWASPDependencyCheckCmd extends AbstractCmd {

	private readonly updateOWASPDepencencyCheck: boolean;

	constructor(installDir: string) {
		super(installDir);

		this.updateOWASPDepencencyCheck = this.getBooleanParameter(
			core.getInput(HeadlessParameters.UPDATE_OWASP_DEPENDENCY_CHECK_DATABASE, { required: false }), true);
	}

	protected shortName(): string {
		return "Update OWASP Dependency Check repository";
	}

	protected canExecuted(): boolean {
		return this.updateOWASPDepencencyCheck;
	}

	protected buildCommandLines(): string[][] {

		const ret: string[][] = [];

		ret.push(CmdLineUtil.mkCommandLineForOwaspDbUpdate(this.installDir, this.logLevel, this.licenseServerRetryCount,

			this.proxyServer, this.proxyPort, this.proxyUser, this.proxyPassword));

		return ret;
	}
}