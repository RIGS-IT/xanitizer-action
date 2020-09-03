import * as core from '@actions/core';

import { AbstractCmdForProject } from './abstract-cmd-for-project';
import { CmdLineUtil } from '../headless-util/commandline-util';
import { HeadlessParameters } from '../headless-util/headless-parameters';
import { GitHubParameters } from '../headless-util/github-parameters';

export class CreateReportsCmds extends AbstractCmdForProject {

	protected readonly overviewReportOutputFile: string;
	protected readonly overviewReportOutputFiles: string[];

	protected readonly findingsListReportOutputFile: string;
	protected readonly findingsListReportOutputFiles: string[];
	protected readonly onlyProblemsInFindingsListReport: boolean;
	protected readonly generateDetailsInFindingsListReport: boolean;

	constructor(installDir: string, githubCheckoutPath: string, githubProjectName: string) {
		super(installDir, githubCheckoutPath, githubProjectName);

		this.overviewReportOutputFile = core.getInput(HeadlessParameters.OVERVIEW_REPORT_OUTPUT_FILE, { required: false });
		{
			const files: string = core.getInput(GitHubParameters.OVERVIEW_REPORT_OUTPUT_FILES, { required: false });
			if (files != null && files.length > 0) {
				this.overviewReportOutputFiles = files.split(',');
			} else {
				this.overviewReportOutputFiles = null;
			}
		}

		this.findingsListReportOutputFile = core.getInput(HeadlessParameters.FINDINGS_LIST_REPORT_OUTPUT_FILE, { required: false });
		{
			const files: string = core.getInput(GitHubParameters.FINDINGS_LIST_REPORT_OUTPUT_FILES, { required: false });
			if (files != null && files.length > 0) {
				this.findingsListReportOutputFiles = files.split(',');
			} else {
				this.findingsListReportOutputFiles = null;
			}
		}
		this.onlyProblemsInFindingsListReport = this.getBooleanParameter(
			core.getInput(HeadlessParameters.ONLY_PROBLEMS_IN_FINDINGS_LIST_REPORT, { required: false }), true);
		this.generateDetailsInFindingsListReport = this.getBooleanParameter(
			core.getInput(HeadlessParameters.GENERATE_DETAILS_IN_FINDINGS_LIST_REPORT, { required: false }), true);

		// no reports set - use findings list PDF and SARIF as default
		if (this.canExecuted() === false) {
			this.findingsListReportOutputFiles = [];
			this.findingsListReportOutputFiles.push("Xanitizer-Findings-List.pdf");
			this.findingsListReportOutputFiles.push("Xanitizer-Findings-List.sarif");
		}
	}

	protected shortName(): string {
		return "Create report";
	}

	protected canExecuted(): boolean {
		return this.overviewReportOutputFile != null && this.overviewReportOutputFile.length > 0
			|| this.overviewReportOutputFiles != null && this.overviewReportOutputFiles.length > 0
			|| this.findingsListReportOutputFile != null && this.findingsListReportOutputFile.length > 0
			|| this.findingsListReportOutputFiles != null && this.findingsListReportOutputFiles.length > 0;
	}

	protected buildCommandLines(): string[][] {

		const ret: string[][] = [];

		if (this.overviewReportOutputFile != null && this.overviewReportOutputFile.length > 0) {
			ret.push(CmdLineUtil.mkCommandLineForReport(this.installDir, this.logLevel, this.licenseServerRetryCount,

				this.proxyServer, this.proxyPort, this.proxyUser, this.proxyPassword,

				this.configFile, this.projectDataDirectory,

				this.projectName, this.configFileDirectory, this.rootDirectory,

				this.overviewReportOutputFile, null, false, false));
		}

		if (this.overviewReportOutputFiles != null && this.overviewReportOutputFiles.length > 0) {
			this.overviewReportOutputFiles.forEach(file => {
				if (file == null && file.trim().length === 0) {
					return;
				}

				ret.push(CmdLineUtil.mkCommandLineForReport(this.installDir, this.logLevel, this.licenseServerRetryCount,

					this.proxyServer, this.proxyPort, this.proxyUser, this.proxyPassword,

					this.configFile, this.projectDataDirectory,

					this.projectName, this.configFileDirectory, this.rootDirectory,

					file.trim(), null, false, false));
			});
		}

		if (this.findingsListReportOutputFile != null && this.findingsListReportOutputFile.length > 0) {
			ret.push(CmdLineUtil.mkCommandLineForReport(this.installDir, this.logLevel, this.licenseServerRetryCount,

				this.proxyServer, this.proxyPort, this.proxyUser, this.proxyPassword,

				this.configFile, this.projectDataDirectory,

				this.projectName, this.configFileDirectory, this.rootDirectory,

				null, this.findingsListReportOutputFile, this.onlyProblemsInFindingsListReport, this.generateDetailsInFindingsListReport));
		}

		if (this.findingsListReportOutputFiles != null && this.findingsListReportOutputFiles.length > 0) {
			this.findingsListReportOutputFiles.forEach(file => {
				if (file == null && file.trim().length === 0) {
					return;
				}

				ret.push(CmdLineUtil.mkCommandLineForReport(this.installDir, this.logLevel, this.licenseServerRetryCount,

					this.proxyServer, this.proxyPort, this.proxyUser, this.proxyPassword,

					this.configFile, this.projectDataDirectory,

					this.projectName, this.configFileDirectory, this.rootDirectory,

					null, file.trim(), this.onlyProblemsInFindingsListReport, this.generateDetailsInFindingsListReport));
			});
		}

		return ret;
	}
}