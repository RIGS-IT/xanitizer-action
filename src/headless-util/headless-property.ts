/**
 * This is an adapted transfer to TypeScript of com.rigsit.xanitizer.headless.util.HeadlessProperty (Java).
 *
 * Changes have to be reflected at the original source file too.
 */

export enum HeadlessProperty {
	MISSING_SEARCH_PATHS, // haltOn Property

	NEW_FINDINGS, // haltOn Property

	FINDINGS, // haltOn Property

	ISSUES, // haltOn Property

	RESULT, // final result

	MISSING_SEARCH_PATHS_STATUS,

	FINDINGS_STATUS,

	NEW_FINDINGS_STATUS,

	WORKSPACE_ISSUES_STATUS,

	CALL_GRAPH_ISSUES_STATUS,

	ANALYSIS_ISSUES_STATUS,

	MIGRATION_ISSUES_STATUS
}