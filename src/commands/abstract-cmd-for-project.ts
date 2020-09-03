import * as core from '@actions/core';

import { AbstractCmd } from './abstract-cmd';
import { HeadlessParameters } from '../headless-util/headless-parameters';

export abstract class AbstractCmdForProject extends AbstractCmd {

	protected readonly configFile: string;

	protected readonly projectDataDirectory: string;

	protected readonly projectName: string;
	protected readonly configFileDirectory: string;
	protected readonly overwriteConfigFile: boolean;
	protected readonly rootDirectory: string;

	constructor(installDir: string,
		protected readonly githubCheckoutPath: string, protected readonly githubProjectName: string) {
		super(installDir);

		this.configFile = core.getInput(HeadlessParameters.CONFIG_FILE, { required: false });

		this.projectDataDirectory = core.getInput(HeadlessParameters.PROJECT_DATA_DIRECTORY, { required: false });

		this.projectName = core.getInput(HeadlessParameters.PROJECT_NAME, { required: false });
		this.configFileDirectory = core.getInput(HeadlessParameters.CONFIG_FILE_DIRECTORY, { required: false });
		this.overwriteConfigFile = this.getBooleanParameter(
			core.getInput(HeadlessParameters.OVERWRITE_CONFIG_FILE, { required: false }), true);
		this.rootDirectory = core.getInput(HeadlessParameters.ROOT_DIRECTORY, { required: false });

		// No configuration file and no root directory set => use checkout path as root directory.
		if ((this.configFile == null || this.configFile.length === 0)
			&& (this.rootDirectory == null || this.rootDirectory.length === 0)) {
			this.rootDirectory = this.githubCheckoutPath;
		}

		// Patch root directory dependent attributes if neccessary.
		if (this.rootDirectory != null && this.rootDirectory.length > 0) {
			if (this.configFileDirectory == null || this.configFileDirectory.length === 0) {
				this.configFileDirectory = this.githubCheckoutPath;
			}
		}
	}
}