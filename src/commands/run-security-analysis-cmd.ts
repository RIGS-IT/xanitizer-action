import * as core from '@actions/core';

import { AbstractCmdForProject } from './abstract-cmd-for-project';
import { CmdLineUtil } from '../headless-util/commandline-util';
import { HeadlessParameters } from '../headless-util/headless-parameters';
import { GitHubParameters } from '../headless-util/github-parameters';

export class RunSecurityAnalysisCmd extends AbstractCmdForProject {

	private readonly compileToJavaScript: boolean;
	private readonly mavenRepository: string;
	private readonly performNodeAudit: boolean;

	private readonly newFindingsRatingThreshold: number;
	private readonly findingsRatingThreshold: number;

	private readonly haltOnMissingSearchPaths: boolean;
	private readonly haltOnNewFindings: boolean;
	private readonly haltOnFindings: boolean;
	private readonly haltOnIssues: string;

	constructor(installDir: string, githubCheckoutPath: string, githubProjectName: string) {
		super(installDir, githubCheckoutPath, githubProjectName);

		this.compileToJavaScript = this.getBooleanParameter(
			core.getInput(HeadlessParameters.JavaScript_ALLOW_XANITIZER_COMPILATION, { required: false }), true);
		this.mavenRepository = core.getInput(HeadlessParameters.LOCAL_MAVEN_REPOSITORY, { required: false });
		this.performNodeAudit = this.getBooleanParameter(
			core.getInput(HeadlessParameters.JavaScript_PERFORM_NODE_AUDIT, { required: false }), true);

		this.newFindingsRatingThreshold = this.getNumberParameter(
			core.getInput(HeadlessParameters.NEW_FINDINGS_RATING_THRESHOLD, { required: false }), -1,
			HeadlessParameters.NEW_FINDINGS_RATING_THRESHOLD);
		this.findingsRatingThreshold = this.getNumberParameter(
			core.getInput(HeadlessParameters.FINDINGS_RATING_THRESHOLD, { required: false }), -1,
			HeadlessParameters.FINDINGS_RATING_THRESHOLD);

		this.haltOnMissingSearchPaths = this.getBooleanParameter(
			core.getInput(HeadlessParameters.HALT_ON_MISSING_SEARCH_PATHS, { required: false }), false);
		this.haltOnNewFindings = this.getBooleanParameter(
			core.getInput(HeadlessParameters.HALT_ON_NEW_FINDINGS, { required: false }), false);
		this.haltOnFindings = this.getBooleanParameter(
			core.getInput(HeadlessParameters.HALT_ON_FINDINGS, { required: false }), false);
		this.haltOnIssues = core.getInput(HeadlessParameters.HALT_ON_ISSUES, { required: false });
	}

	protected shortName(): string {
		return "Run security analysis";
	}

	protected canExecuted(): boolean {
		return true;
	}

	protected outputParameter(): string | null {
		return GitHubParameters.SECURITY_ANALYSIS_OUTPUT;
	}

	protected buildCommandLines(): string[][] {

		const ret: string[][] = [];

		ret.push(CmdLineUtil.mkCommandLineForAnalysis(this.installDir, this.logLevel, this.licenseServerRetryCount,

			this.proxyServer, this.proxyPort, this.proxyUser, this.proxyPassword,

			this.configFile, this.projectDataDirectory,

			this.projectName, this.configFileDirectory, this.overwriteConfigFile, this.rootDirectory,

			this.compileToJavaScript, this.mavenRepository, this.performNodeAudit,

				/* create snapshot */false, null,

				/* create report */null, null, false, false,

				/* merge project */ null, null,

				/* export project */ null, false, null,

			this.haltOnFindings, this.haltOnNewFindings, this.haltOnMissingSearchPaths,
			this.newFindingsRatingThreshold, this.findingsRatingThreshold, this.haltOnIssues));

		return ret;
	}
}