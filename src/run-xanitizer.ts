import * as core from '@actions/core';
import * as github from '@actions/github';

import * as os from 'os';
import * as path from 'path';

import { InstallLicenseFileCmd } from './commands/install-license-file-cmd';
import { UpdateOWASPDependencyCheckCmd } from './commands/update-owasp-dependency-check-cmd';
import { MergeProjectCmd } from './commands/merge-project-cmd';
import { RunSecurityAnalysisCmd } from './commands/run-security-analysis-cmd';
import { CreateReportsCmds } from './commands/create-reports-cmds';
import { CreateSnapshotCmd } from './commands/create-snapshot-cmd';
import { ExportProjectCmd } from './commands/export-project-cmd';

import { CmdLineUtil } from './headless-util/commandline-util';
import { GitHubParameters } from './headless-util/github-parameters';
import { EnvVars } from './headless-util/env-vars';

export async function run(installParentDir: string, version: string): Promise<void> {

	const installDir: string = installParentDir + path.sep + "Xanitizer-" + version;

	const error: string = CmdLineUtil.validateInstallDir(installDir);
	if (error != null && error.length > 0) {
		throw new Error(error);
	}

	// Home directory
	const homeDir: string = os.homedir();
	{
		if (homeDir == null || homeDir.length === 0) {
			throw new Error(`User home directory is not defined.`);
		}
	}

	// GitHub workspace
	let githubCheckoutPath: string = "";
	{
		const envVar: string = EnvVars[EnvVars.GITHUB_WORKSPACE];
		githubCheckoutPath = process.env[envVar];
		if (githubCheckoutPath == null || githubCheckoutPath.length === 0) {
			throw new Error(`Environment variable ${envVar} not defined.`);
		}
		const subDir = core.getInput(GitHubParameters.CHECKOUT_PATH);
		if (subDir != null && subDir.length > 0) {
			githubCheckoutPath += path.sep + subDir;
		}
		githubCheckoutPath = path.normalize(githubCheckoutPath);
	}
	core.info(`GitHub checkout path ${githubCheckoutPath} used by Xanitizer.`);

	const githubProjectName: string = github.context.repo.repo;
	core.info(`GitHub project name ${githubProjectName} used by Xanitizer.`);

	core.exportVariable(EnvVars[EnvVars.XAN_GITHUB_CHECKOUT_LOCATION], githubCheckoutPath);

	await (new InstallLicenseFileCmd(homeDir)).run();
	await (new UpdateOWASPDependencyCheckCmd(installDir)).run();
	await (new MergeProjectCmd(installDir, githubCheckoutPath, githubProjectName)).run();
	await (new RunSecurityAnalysisCmd(installDir, githubCheckoutPath, githubProjectName)).run();
	await (new CreateReportsCmds(installDir, githubCheckoutPath, githubProjectName)).run();
	await (new CreateSnapshotCmd(installDir, githubCheckoutPath, githubProjectName)).run();
	await (new ExportProjectCmd(installDir, githubCheckoutPath, githubProjectName)).run();
}