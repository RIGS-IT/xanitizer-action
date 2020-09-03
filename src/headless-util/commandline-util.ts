import * as fs from 'fs';
import * as path from 'path';

import { HeadlessParameters } from './headless-parameters';

/**
 * This is an adapted transfer to TypeScript of com.rigsit.xanitizer.headless.util.CmdLineUtil (Java).
 *
 * Changes have to be reflected at the original source file too.
 */

export class CmdLineUtil {

	public static validateInstallDir(installDir: string): string {
		if (installDir == null || installDir.length === 0) {
			return "Parameter 'installDir' not set";
		}

		if (!fs.statSync(installDir).isDirectory()) {
			return "Parameter 'installDir' is not set to an existing directory: '"
				+ installDir.toString() + "'";
		}

		return null;
	}

	public static mkCommandLineForAnalysis(installDir: string,
		logLevel: string, licenseServerRetryCount: string,

		proxyServer: string, proxyPort: string, proxyUser: string,
		proxyPW: string,

		configFile: string, projectDataDirectoryOrNull: string,

		projectName: string, configDir: string, overwriteConfigFile: boolean,
		rootDir: string, compileToJavaScript: boolean, mavenRepository: string,
		performNodeAudit: boolean,

		createSnapshot: boolean, snapshotComment: string,

		overviewReportOutputFile: string, findingsListReportOutputFile: string,
		onlyProblemsInFindingsListReport: boolean,
		generateDetailsInFindingsListReport: boolean,

		mergedProject: string, importPassphrase: string,

		exportDirectory: string, exportSnapshot: boolean,
		exportPassphrase: string,

		haltOnFindings: boolean, haltOnNewFindings: boolean,
		haltOnMissingSearchPaths: boolean, newFindingsRatingThreshold: number,
		findingsRatingThreshold: number, haltOnIssues: string): string[] {

		const result: string[] = [];

		const execName: string = CmdLineUtil.getExecutable(installDir);
		if (execName == null) {
			return null;
		}

		result.push(execName);

		if (logLevel != null && logLevel.length > 0) {
			result.push(HeadlessParameters.LOG_LEVEL + "=" + logLevel);
		}

		if (licenseServerRetryCount != null && licenseServerRetryCount.length > 0) {
			result.push(HeadlessParameters.LICENSE_SERVER_RETRY_COUNT + "=" + licenseServerRetryCount);
		}

		if (configFile != null && configFile.length > 0) {
			result.push(HeadlessParameters.CONFIG_FILE + "=" + configFile);
		}

		if (projectDataDirectoryOrNull != null && projectDataDirectoryOrNull.length > 0) {
			result.push(HeadlessParameters.PROJECT_DATA_DIRECTORY + "=" + projectDataDirectoryOrNull);
		}

		if (projectName != null && projectName.length > 0) {
			result.push(HeadlessParameters.PROJECT_NAME + "=" + projectName);
		}
		if (configDir != null && configDir.length > 0) {
			result.push(HeadlessParameters.CONFIG_FILE_DIRECTORY + "=" + configDir);
		}
		if (overwriteConfigFile) {
			result.push(HeadlessParameters.OVERWRITE_CONFIG_FILE + "=" + overwriteConfigFile);
		}
		if (rootDir != null && rootDir.length > 0) {
			result.push(HeadlessParameters.ROOT_DIRECTORY + "=" + rootDir);
		}

		if (compileToJavaScript != null) {
			result.push(HeadlessParameters.JavaScript_ALLOW_XANITIZER_COMPILATION + "=" + compileToJavaScript);
		}
		if (performNodeAudit != null) {
			result.push(HeadlessParameters.JavaScript_PERFORM_NODE_AUDIT + "=" + performNodeAudit);
		}

		if (mavenRepository != null && mavenRepository.length > 0) {
			result.push(HeadlessParameters.LOCAL_MAVEN_REPOSITORY + "=" + mavenRepository);
		}

		result.push(HeadlessParameters.CREATE_SNAPSHOT + "=" + createSnapshot);
		if (snapshotComment != null && snapshotComment.length > 0) {
			result.push(HeadlessParameters.SNAPSHOT_COMMENT + "=" + snapshotComment);
		}

		if (overviewReportOutputFile != null && overviewReportOutputFile.length > 0) {
			result.push(HeadlessParameters.OVERVIEW_REPORT_OUTPUT_FILE + "=" + overviewReportOutputFile);
		}

		if (findingsListReportOutputFile != null && findingsListReportOutputFile.length > 0) {
			result.push(HeadlessParameters.FINDINGS_LIST_REPORT_OUTPUT_FILE + "=" + findingsListReportOutputFile);
			result.push(HeadlessParameters.ONLY_PROBLEMS_IN_FINDINGS_LIST_REPORT + "=" + onlyProblemsInFindingsListReport);
			result.push(HeadlessParameters.GENERATE_DETAILS_IN_FINDINGS_LIST_REPORT + "=" + generateDetailsInFindingsListReport);
		}

		if (exportDirectory != null && exportDirectory.length > 0) {
			result.push(HeadlessParameters.EXPORT_DIRECTORY + "=" + exportDirectory);
		}

		if (exportSnapshot) {
			result.push(HeadlessParameters.EXPORT_SNAPSHOTS + "=true");
		}

		if (exportPassphrase != null && exportPassphrase.length > 0) {
			result.push(
				HeadlessParameters.EXPORT_PASSPHRASE + "=" + exportPassphrase);
		}

		if (mergedProject != null && mergedProject.length > 0) {
			result.push(HeadlessParameters.MERGED_PROJECT + "=" + mergedProject);
		}

		if (importPassphrase != null && importPassphrase.length !== 0) {
			result.push(
				HeadlessParameters.IMPORT_PASSPHRASE + "=" + importPassphrase);
		}

		if (haltOnFindings) {
			result.push(HeadlessParameters.HALT_ON_FINDINGS + "=" + haltOnFindings);
		}

		if (haltOnNewFindings) {
			result.push(HeadlessParameters.HALT_ON_NEW_FINDINGS + "=" + haltOnNewFindings);
		}

		if (haltOnMissingSearchPaths) {
			result.push(HeadlessParameters.HALT_ON_MISSING_SEARCH_PATHS + "=" + haltOnMissingSearchPaths);
		}

		if (haltOnIssues != null && haltOnIssues.length > 0) {
			result.push(HeadlessParameters.HALT_ON_ISSUES + "=" + haltOnIssues);
		}

		if (newFindingsRatingThreshold !== -1) {
			result.push(HeadlessParameters.NEW_FINDINGS_RATING_THRESHOLD + "=" + newFindingsRatingThreshold);
		}

		if (findingsRatingThreshold !== -1) {
			result.push(HeadlessParameters.FINDINGS_RATING_THRESHOLD + "=" + findingsRatingThreshold);
		}

		CmdLineUtil.addProxyServer(result, proxyServer, proxyPort, proxyUser, proxyPW);

		return result;
	}

	public static mkCommandLineForReport(installDir: string,
		logLevel: string, licenseServerRetryCount: string,

		proxyServer: string, proxyPort: string, proxyUser: string,
		proxyPW: string,

		configFile: string, projectDataDirectoryOrNull: string,

		projectName: string, configDir: string, rootDir: string,

		overviewReportOutputFile: string, findingsListReportOutputFile: string,
		onlyProblemsInFindingsListReport: boolean,
		generateDetailsInFindingsListReport: boolean): string[] {

		const result: string[] = [];

		const execName: string = CmdLineUtil.getExecutable(installDir);
		if (execName == null) {
			return null;
		}

		result.push(execName);

		if (logLevel != null && logLevel.length > 0) {
			result.push(HeadlessParameters.LOG_LEVEL + "=" + logLevel);
		}

		if (licenseServerRetryCount != null && licenseServerRetryCount.length > 0) {
			result.push(HeadlessParameters.LICENSE_SERVER_RETRY_COUNT + "=" + licenseServerRetryCount);
		}

		if (configFile != null && configFile.length > 0) {
			result.push(HeadlessParameters.CONFIG_FILE + "=" + configFile);
		}

		if (projectDataDirectoryOrNull != null && projectDataDirectoryOrNull.length > 0) {
			result.push(HeadlessParameters.PROJECT_DATA_DIRECTORY + "=" + projectDataDirectoryOrNull);
		}

		if (projectName != null && projectName.length > 0) {
			result.push(HeadlessParameters.PROJECT_NAME + "=" + projectName);
		}
		if (configDir != null && configDir.length > 0) {
			result.push(HeadlessParameters.CONFIG_FILE_DIRECTORY + "=" + configDir);
		}
		if (rootDir != null) {
			result.push(HeadlessParameters.ROOT_DIRECTORY + "=" + rootDir);
		}

		result.push(HeadlessParameters.NO_ANALYSIS + "=true");

		if (overviewReportOutputFile != null && overviewReportOutputFile.length > 0) {
			result.push(HeadlessParameters.OVERVIEW_REPORT_OUTPUT_FILE + "=" + overviewReportOutputFile);
		}

		if (findingsListReportOutputFile != null && findingsListReportOutputFile.length > 0) {
			result.push(HeadlessParameters.FINDINGS_LIST_REPORT_OUTPUT_FILE + "=" + findingsListReportOutputFile);
			result.push(HeadlessParameters.ONLY_PROBLEMS_IN_FINDINGS_LIST_REPORT + "=" + onlyProblemsInFindingsListReport);
			result.push(HeadlessParameters.GENERATE_DETAILS_IN_FINDINGS_LIST_REPORT
				+ "=" + generateDetailsInFindingsListReport);
		}

		CmdLineUtil.addProxyServer(result, proxyServer, proxyPort, proxyUser, proxyPW);

		return result;
	}

	public static mkCommandLineForSnapshot(installDir: string,
		logLevel: string, licenseServerRetryCount: string,

		proxyServer: string, proxyPort: string, proxyUser: string,
		proxyPW: string,

		configFile: string, projectDataDirectoryOrNull: string,

		projectName: string, configDir: string, rootDir: string,

		snapshotComment: string): string[] {

		const result: string[] = [];

		const execName: string = CmdLineUtil.getExecutable(installDir);
		if (execName == null) {
			return null;
		}

		result.push(execName);

		if (logLevel != null && logLevel.length > 0) {
			result.push(HeadlessParameters.LOG_LEVEL + "=" + logLevel);
		}

		if (licenseServerRetryCount != null && licenseServerRetryCount.length > 0) {
			result.push(HeadlessParameters.LICENSE_SERVER_RETRY_COUNT + "=" + licenseServerRetryCount);
		}

		if (configFile != null && configFile.length > 0) {
			result.push(HeadlessParameters.CONFIG_FILE + "=" + configFile);
		}

		if (projectDataDirectoryOrNull != null && projectDataDirectoryOrNull.length > 0) {
			result.push(HeadlessParameters.PROJECT_DATA_DIRECTORY + "=" + projectDataDirectoryOrNull);
		}

		if (projectName != null && projectName.length > 0) {
			result.push(HeadlessParameters.PROJECT_NAME + "=" + projectName);
		}
		if (configDir != null && configDir.length > 0) {
			result.push(HeadlessParameters.CONFIG_FILE_DIRECTORY + "=" + configDir);
		}
		if (rootDir != null && rootDir.length > 0) {
			result.push(HeadlessParameters.ROOT_DIRECTORY + "=" + rootDir);
		}

		result.push(HeadlessParameters.NO_ANALYSIS + "=true");

		result.push(HeadlessParameters.CREATE_SNAPSHOT + "=true");
		if (snapshotComment != null) {
			result.push(HeadlessParameters.SNAPSHOT_COMMENT + "=" + snapshotComment);
		}

		CmdLineUtil.addProxyServer(result, proxyServer, proxyPort, proxyUser, proxyPW);

		return result;
	}

	public static mkCommandLineForExportProject(installDir: string,
		logLevel: string, licenseServerRetryCount: string,

		proxyServer: string, proxyPort: string, proxyUser: string,
		proxyPW: string,

		configFile: string, projectDataDirectoryOrNull: string,

		projectName: string, configDir: string, rootDir: string,

		exportDirectory: string, exportSnapshots: boolean,
		exportPassphrase: string): string[] {

		const result: string[] = [];

		const execName: string = CmdLineUtil.getExecutable(installDir);
		if (execName == null) {
			return null;
		}

		result.push(execName);

		if (logLevel != null && logLevel.length > 0) {
			result.push(HeadlessParameters.LOG_LEVEL + "=" + logLevel);
		}

		if (licenseServerRetryCount != null && licenseServerRetryCount.length > 0) {
			result.push(HeadlessParameters.LICENSE_SERVER_RETRY_COUNT + "=" + licenseServerRetryCount);
		}

		if (configFile != null && configFile.length > 0) {
			result.push(HeadlessParameters.CONFIG_FILE + "=" + configFile);
		}

		if (projectDataDirectoryOrNull != null && projectDataDirectoryOrNull.length > 0) {
			result.push(HeadlessParameters.PROJECT_DATA_DIRECTORY + "=" + projectDataDirectoryOrNull);
		}

		if (projectName != null && projectName.length > 0) {
			result.push(HeadlessParameters.PROJECT_NAME + "=" + projectName);
		}
		if (configDir != null && configDir.length > 0) {
			result.push(HeadlessParameters.CONFIG_FILE_DIRECTORY + "=" + configDir);
		}
		if (rootDir != null && rootDir.length > 0) {
			result.push(HeadlessParameters.ROOT_DIRECTORY + "=" + rootDir);
		}

		result.push(HeadlessParameters.NO_ANALYSIS + "=true");

		if (exportDirectory != null && exportDirectory.length > 0) {
			result.push(HeadlessParameters.EXPORT_DIRECTORY + "=" + exportDirectory);
		}

		if (exportSnapshots) {
			result.push(HeadlessParameters.EXPORT_SNAPSHOTS + "=true");
		}

		if (exportPassphrase != null && exportPassphrase.length > 0) {
			result.push(
				HeadlessParameters.EXPORT_PASSPHRASE + "=" + exportPassphrase);
		}

		CmdLineUtil.addProxyServer(result, proxyServer, proxyPort, proxyUser, proxyPW);

		return result;
	}

	public static mkCommandLineForMergeProject(installDir: string,
		logLevel: string, licenseServerRetryCount: string,

		proxyServer: string, proxyPort: string, proxyUser: string,
		proxyPW: string,

		configFile: string, projectDataDirectoryOrNull: string,

		projectName: string, configDir: string, rootDir: string,

		mergedProject: string, importPassphrase: string): string[] {

		const result: string[] = [];

		const execName: string = CmdLineUtil.getExecutable(installDir);
		if (execName == null) {
			return null;
		}

		result.push(execName);

		if (logLevel != null && logLevel.length > 0) {
			result.push(HeadlessParameters.LOG_LEVEL + "=" + logLevel);
		}

		if (licenseServerRetryCount != null && licenseServerRetryCount.length > 0) {
			result.push(HeadlessParameters.LICENSE_SERVER_RETRY_COUNT + "=" + licenseServerRetryCount);
		}

		if (configFile != null && configFile.length > 0) {
			result.push(HeadlessParameters.CONFIG_FILE + "=" + configFile);
		}

		if (projectDataDirectoryOrNull != null && projectDataDirectoryOrNull.length > 0) {
			result.push(HeadlessParameters.PROJECT_DATA_DIRECTORY + "=" + projectDataDirectoryOrNull);
		}

		if (projectName != null && projectName.length > 0) {
			result.push(HeadlessParameters.PROJECT_NAME + "=" + projectName);
		}
		if (configDir != null && configDir.length > 0) {
			result.push(HeadlessParameters.CONFIG_FILE_DIRECTORY + "=" + configDir);
		}
		if (rootDir != null && rootDir.length > 0) {
			result.push(HeadlessParameters.ROOT_DIRECTORY + "=" + rootDir);
		}

		result.push(HeadlessParameters.NO_ANALYSIS + "=true");

		if (mergedProject != null && mergedProject.length > 0) {
			result.push(HeadlessParameters.MERGED_PROJECT + "=" + mergedProject);
		}

		if (importPassphrase != null && importPassphrase.length > 0) {
			result.push(
				HeadlessParameters.IMPORT_PASSPHRASE + "=" + importPassphrase);
		}

		CmdLineUtil.addProxyServer(result, proxyServer, proxyPort, proxyUser, proxyPW);

		return result;
	}

	public static mkCommandLineForOwaspDbUpdate(installDir: string,
		logLevel: string, licenseServerRetryCount: string,

		proxyServer: string, proxyPort: string, proxyUser: string,
		proxyPW: string): string[] {

		const result: string[] = [];

		const execName: string = CmdLineUtil.getExecutable(installDir);
		if (execName == null) {
			return null;
		}

		result.push(execName);

		if (logLevel != null && logLevel.length > 0) {
			result.push(HeadlessParameters.LOG_LEVEL + "=" + logLevel);
		}

		if (licenseServerRetryCount != null && licenseServerRetryCount.length > 0) {
			result.push(HeadlessParameters.LICENSE_SERVER_RETRY_COUNT + "=" + licenseServerRetryCount);
		}

		result.push(
			HeadlessParameters.UPDATE_OWASP_DEPENDENCY_CHECK_DATABASE + "=true");

		CmdLineUtil.addProxyServer(result, proxyServer, proxyPort, proxyUser, proxyPW);

		return result;
	}

	private static getExecutable(installDir: string): string {

		let execName: string = installDir + path.sep;
		switch (process.platform) {
			case "linux": execName += "XanitizerHeadless"; break;
			case "win32": execName += "XanitizerHeadless.exe"; break;
			// No headless mode for macOS supported:
			// case "darwin": execName += "XanitizerHeadless"; break;
			default: throw new Error(`Unsupported operating system to run Xanitizer '${process.platform}'.`);
		}

		if (fs.statSync(execName).isFile() === false) {
			return null;
		}

		return execName;
	}

	private static addProxyServer(result: string[],

		proxyServer: string, proxyPort: string, proxyUser: string,
		proxyPW: string) {
		if (proxyServer != null && proxyServer.length > 0) {
			result.push(HeadlessParameters.PROXY_SERVER + "=" + proxyServer);
			if (proxyPort != null && proxyPort.length > 0) {
				result.push(HeadlessParameters.PROXY_PORT + "=" + proxyPort);
			}
			if (proxyUser != null && proxyUser.length > 0) {
				result.push(HeadlessParameters.PROXY_USER + "=" + proxyUser);
				if (proxyPW != null && proxyPW.length > 0) {
					result.push(HeadlessParameters.PROXY_PASSWORD + "=" + proxyPW);
				}
			}
		}
	}
}
