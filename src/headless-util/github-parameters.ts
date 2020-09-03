export enum GitHubParameters {

	/**
	 * Relative path under $GITHUB_WORKSPACE where the project was checked out.
	 * Please use the same value as for parameter 'path' of the configured actions/checkout action.
	 *
	 * @see https://github.com/actions/checkout#usage parameter 'path'
	 */
	CHECKOUT_PATH = "checkoutPath",

	/**
	 * String which is used as input for a Xanitizer license file.
	 */
	LICENSE = "license",

	/**
	 * Comma separated list of output locations of the overview reports.
	 * This has to be either a list of files or the parameter has to be undefined or empty if no overview reports should be written.
	 * Allowed file extensions are: pdf, html, docx.
	 */
	OVERVIEW_REPORT_OUTPUT_FILES = "overviewReportOutputFiles",

	/**
	 * Comma separated list of output locations of the findings list reports.
	 * This has to be either a list of files or the parameter has to be undefined or empty if no findings list reports should be written.
	 * Allowed file extensions are: pdf, html, docx, xml, csv, sarif.
	 * Note: If no report file has been secified, neither an overview report nor a findings list report,
	 * a PDF and a SARIF findings list report will be generated in the checkout directory 
	 * specified by $GITHUB_WORKSPACE with the optional relative parameter 'checkoutPath' as default.
	 */
	FINDINGS_LIST_REPORT_OUTPUT_FILES = "findingsListReportOutputFiles",
	
	/**
	 * Status messages of the result of the security analysis.
	 */
	SECURITY_ANALYSIS_OUTPUT = "security_analysis"

}