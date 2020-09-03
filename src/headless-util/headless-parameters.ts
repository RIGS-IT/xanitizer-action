/**
 * This is an adapted transfer to TypeScript of com.rigsit.xanitizer.headless.util.HeadlessParameters (Java).
 *
 * Changes have to be reflected at the original source file too.
 */

export enum HeadlessParameters {
	/**
	 * The path to the Xanitizer configuration file of the project that should be analyzed.
	 * Either this parameter or the parameter 'rootDirectory' must be specified, but not both.
	 */
	CONFIG_FILE = "configFile",

	/**
	 * The root directory, to be used for default set-ups.
	 * Either this parameter or the parameter 'configFile' must be specified, but not both.
	 */
	ROOT_DIRECTORY = "rootDirectory",

	/**
	 * The project name that should be used.
	 * Only relevant if the parameter 'rootDirectory' is specified.
	 * If not given, the simple name of the root directory is used.
	 */
	PROJECT_NAME = "projectName",

	/**
	 * The directory where to put the generated configuration file.
	 * Only relevant if the parameter 'rootDirectory' is specified.
	 * If not given, the  configuration file is generated in a subdirectory of the user's .Xanitizer directory.
	 */
	CONFIG_FILE_DIRECTORY = "configFileDirectory",

	/**
	 * Boolean flag specifying if an existing config file is to be overwritten.
	 * Only relevant if the parameter 'rootDirectory' is specified.
	 */
	OVERWRITE_CONFIG_FILE = "overwriteConfigFile",

	/**
	 * Xanitizer's project data directory, if it is not the default one in <HOME>/.Xanitizer
	 * or the one specified in that default directory.
	 */
	PROJECT_DATA_DIRECTORY = "projectDataDirectory",

	/**
	 * Boolean flag specifying whether Xanitizer uses NodeJS
	 * to compile Angular and TypeScript projects to JavaScript code itself or not.
	 * This could be a potential risk if someone has manipulated the external ng or the tsc script.
	 * Therefore it is necessary to enable this step explicit by setting this option to 'true'.
	 * If the code is already compiled to JavaScript at best with a source map, this option can be set to 'false'.
	 * 	 true - enables the compilation of Angular and TypeScript code to JavaScript by Xanitizer itself
	 *   false - disables the compilation of Angular and TypeScript code to JavaScript by Xanitizer itself
	 *		       and a workspace information will be generated if Angular or Typescript files are found in the project
	 *   not set - if this option is not set and Angular or Typescript files are found in the project,
	 *			   a workspace error will be generated
	 */
	JavaScript_ALLOW_XANITIZER_COMPILATION = "compileToJavaScript",

	/**
	 * Boolean flag specifying if npm audit should be executed.
	 * The npm audit APIs can be used to report on known vulnerable node.js libraries.
	 * This requires an Internet connection and so has to be allowed explicitly. 
	 * This is only relevant for NodeJS projects.
	 */
	JavaScript_PERFORM_NODE_AUDIT = "performNodeAudit",

	/**
	 * Optional path to the local Maven repository.
	 * Note: If no settings are specified, the settings from the Xanitizer properties file will be used.
	 */
	LOCAL_MAVEN_REPOSITORY = "mavenRepository",

	/**
	 * Boolean flag specifying whether a snapshot should be created after parsing and analyzing the current version or not.
	 */
	CREATE_SNAPSHOT = "createSnapshot",

	/**
	 * Optional comment added to the newly created snapshot.
	 * Only relevant if the parameter 'createSnapshot' is true.
	 */
	SNAPSHOT_COMMENT = "snapshotComment",

	/**
	 * The output location of the overview report.
	 * This has to be either a file or the parameter has to be undefined or empty if no overview report should be written.
	 * Allowed file extensions are: pdf, html, docx.
	 */
	OVERVIEW_REPORT_OUTPUT_FILE = "overviewReportOutputFile",

	/**
	 * The output location of the findings list report.
	 * This has to be either a file or the parameter has to be undefined or empty if no findings list report should be written.
	 * Allowed file extensions are: pdf, html, docx, xml, csv, sarif.
	 */
	FINDINGS_LIST_REPORT_OUTPUT_FILE = "findingsListReportOutputFile",

	/**
	 * Boolean flag specifying if only findings with problem classifications are written to the findings list report.
	 */
	ONLY_PROBLEMS_IN_FINDINGS_LIST_REPORT = "onlyProblemsInFindingsListReport",

	/**
	 * Boolean flag specifying if all the details of a finding are written to the findings list report,
	 * e.g.if the output contains all steps of a path.
	 * Note: Only relevant if the file extension of the parameter 'findingsListReportOutputFile' is xml, html, or sarif.
	 */
	GENERATE_DETAILS_IN_FINDINGS_LIST_REPORT = "generateDetailsInFindingsListReport",

	/**
	 * The output directory of the project export.
	 * Note: If the parameter is undefined or an empty string, the project is not exported.
	 */
	EXPORT_DIRECTORY = "exportDirectory",

	/**
	 * Boolean flag specifying if snapshots should be exported or not.
	 * The parameter is only used if an export directory is set.
	 * If the parameter is not set or empty, no snapshots are exported.
	 */
	EXPORT_SNAPSHOTS = "exportSnapshots",

	/**
	 * The passphrase for the project export.
	 * The parameter is only used if an export directory is set.
	 * If the parameter is not set or empty, the exported project is not encrypted.
	 */
	EXPORT_PASSPHRASE = "exportPassphrase",

	/**
	 * The path to an exported Xanitizer project archive file. If specified, this project is merged into the current project.
	 * This means that all more - recent user adaptations, findings and issues are migrated into the current project.
	 */
	MERGED_PROJECT = "mergedProject",

	/**
	 * The passphrase for the merged project.
	 * The parameter is only necessary if the parameter 'mergedProject' is set and the merged project is encrypted.
	 */
	IMPORT_PASSPHRASE = "importPassphrase",

	/**
	 * Boolean flag specifying whether the task should fail if there are search paths configured that do not exist anymore.
	 */
	HALT_ON_MISSING_SEARCH_PATHS = "haltOnMissingSearchPaths",

	/**
	 * A comma - separated list of issue groups that will let the task fail if any of it contains an error issue.
	 * Possible values are ALL_ERRORS, WORKSPACE_ERRORS, CALL_GRAPH_ERRORS, ANALYSIS_ERRORS, MIGRATION_ERRORS.
	 * If the value is not set, this means that issues are not relevant for the success of the task.
	 */
	HALT_ON_ISSUES = "haltOnIssues",

	/**
	 * Boolean flag specifying whether the task should fail if there are * NEW * findings
	 * with a rating equal or higher than the value defined for newFindingsRating.
	 */
	HALT_ON_NEW_FINDINGS = "haltOnNewFindings",

	/**
	 * A rating value. Only used if haltOnNewFindings is set.
	 */
	NEW_FINDINGS_RATING_THRESHOLD = "newFindingsRatingThreshold",

	/**
	 * Boolean flag specifying whether the task should fail if there are findings
	 * with a rating equal or higher than the value defined for findingsRating.
	 */
	HALT_ON_FINDINGS = "haltOnFindings",

	/**
	 * A rating value. Only used if haltOnFindings is set.
	 */
	FINDINGS_RATING_THRESHOLD = "findingsRatingThreshold",

	/**
	 * Boolean flag specifying whether the OWASP Dependency Check repository should be updated or not.
	 * Note: The OWASP Dependency Check is based on vulnerability data stored in a local repository.
	 * It is recommended to update the local OWASP Dependency Check repository on a regular basis
	 * via remote access to the National Vulnerability Database(NIST).
	 * If a proxy server is used to access the internet, please specify the proxy server settings
	 * otherwise the settings from the Xanitizer properties file will be used.
	 */
	UPDATE_OWASP_DEPENDENCY_CHECK_DATABASE = "updateOwaspDependencyCheckRepository",

	/**
	 * Optional proxy server
	 * to access the internet to update the OWASP Dependency Check repository
	 * or to request a license token from the public license server in case of a floating license via a proxy.
	 * Note: If no settings are specified, the settings from the Xanitizer properties file will be used.
	 */
	PROXY_SERVER = "proxyServer",

	/**
	 * Optional proxy server port
	 * to access the National Vulnerability Database(NIST) to update the OWASP Dependency Check repository via a proxy.
	 */
	PROXY_PORT = "proxyPort",

	/**
	 * Optional proxy server user name
	 * to access the National Vulnerability Database(NIST) to update the OWASP Dependency Check repository via a proxy.
	 */
	PROXY_USER = "proxyUser",

	/**
	 * Optional proxy server user password
	 * to access the National Vulnerability DatabaseNIST) to update the OWASP Dependency Check repository via a proxy.
	 */
	PROXY_PASSWORD = "proxyPassword",

	/**
	 * The logging level to be used when running Xanitizer.
	 * Values: OFF, SEVERE, WARNING, INFO, CONFIG, FINE, FINER, FINEST, ALL.
	 */
	LOG_LEVEL = "logLevel",

	/**
	 * Number of attempts to get a license token from the license server.
	 * Note: If the used Xanitizer license is a machine bound license, this parameter will be ignored.
	 * If the used Xanitizer license is a floating license it may happen
	 * that all tokens are in use or the connection to the license server is not available at startup.
	 * In such cases, no license token can be requested successfully from the license server to start Xanitizer
	 * and the headless process would terminate with a license error.
	 * Setting this parameter to a value greater than zero,
	 * Xanitizer attempts every minute to request a license token until the specified count has been reached.
	 * Setting this parameter to zero disables the repetition.
	 */
	LICENSE_SERVER_RETRY_COUNT = "licenseServerRetryCount",

	/**
	 * Boolean flag specifying if an analysis should not be executed for the config file or project root directory.
	 * Note: This is only relevant for separate report generation, snapshot generation and project export.
	 */
	NO_ANALYSIS = "noAnalysis"
}

export enum HeadlessResult {
	XANITIZER_MESSAGE_PFIX = "___XanitizerMessage___{",
	XANITIZER_MESSAGE_SUFFIX = "}___XanitizerMessage___",
	XANITIZER_BATCH_SUCCESFULL = "Batch run completed sucessfully"
}