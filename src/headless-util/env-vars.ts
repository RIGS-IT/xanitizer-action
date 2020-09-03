/**
 * This is an adapted transfer to TypeScript of om.rigsit.xanitizer.pub.util.EnvVars (Java).
 *
 * Changes has to be reflected at the original source file too.
 */

export enum EnvVars {

	/**
	 * Used for the Xanitizer SARIF exporter to make paths relative to the
	 * checkout directory of the GitHub repository. The relative paths are used
	 * by GitHub to display the source code for findings and path segments.
	 *
	 * If the Xanitizer configuration file is not located in the root directory
	 * of the GitHub repository, the relative paths from Xanitizer contain ../
	 * path segments which can not be handled by GitHub.
	 *
	 * Furthermore if this environment variable is set, some special GitHub
	 * changes will be applied to the exported SARIF file so that the resulting
	 * SARIF file can be successfully imported by the GitHub Developer Security
	 * Portal (DSP).
	 */
	XAN_GITHUB_CHECKOUT_LOCATION,

	/** Predefined from GitHub */
	GITHUB_WORKSPACE,
	GITHUB_
}