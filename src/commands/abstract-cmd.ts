import * as core from '@actions/core';
import * as exec from '@actions/exec';

import { HeadlessParameters, HeadlessResult } from '../headless-util/headless-parameters';
import { HeadlessProperty } from '../headless-util/headless-property';

export abstract class AbstractCmd {
	protected readonly logLevel: string;
	protected readonly licenseServerRetryCount: string;

	protected readonly proxyServer: string;
	protected readonly proxyPort: string;
	protected readonly proxyUser: string;
	protected readonly proxyPassword: string;

	constructor(protected readonly installDir: string) {
		this.logLevel = core.getInput(HeadlessParameters.LOG_LEVEL, { required: false });
		this.licenseServerRetryCount = core.getInput(HeadlessParameters.LICENSE_SERVER_RETRY_COUNT, { required: false });

		this.proxyServer = core.getInput(HeadlessParameters.PROXY_SERVER, { required: false });
		this.proxyPort = core.getInput(HeadlessParameters.PROXY_PORT, { required: false });
		this.proxyUser = core.getInput(HeadlessParameters.PROXY_USER, { required: false });
		this.proxyPassword = core.getInput(HeadlessParameters.PROXY_SERVER, { required: false });
	}

	public async run() {
		if (this.canExecuted() === false) {
			return;
		}

		const cmdLines: string[][] = this.buildCommandLines();
		for (let i: number = 0; i < cmdLines.length; i++) {
			const cmdLine = cmdLines[i];
			if (cmdLine == null) {
				throw new Error(`No executable named 'XanitizerHeadless' or 'XanitizerHeadless.exe' found in ${this.installDir}`);
			}

			core.info(`${this.shortName()} command line: ${cmdLine.join(' ')}`);

			const output: string = await this.runCommand(cmdLine);

			this.processOutput(output);

			if (this.outputParameter() != null) {
				core.setOutput(this.outputParameter(), output);
			}
		}
	}

	/** Short name for logging. */
	protected abstract shortName(): string;

	/** Returns true if the parameter settings allows the creation of a command line - otherwise false. */
	protected abstract canExecuted(): boolean;

	/** 
	 * Currently only returns an GitHub action output parameter name for the security analysis 
	 * to export the status messages as GitHub action output.
	 *
	 * @see ./headless-util/headless-property.ts - for Xanitizer status message keys
	 * @see ./abstract-cmd.ts - method processOutput() for evaluating Xanitizer status message keys
	 **/
	protected outputParameter(): string | null {
		return null;
	}

	/** Returns a commandline or null if executable could not be found. */
	protected abstract buildCommandLines(): string[][];

	private async runCommand(cmdLine: string[]): Promise<string> {

		let ret: string = "";

		const options: exec.ExecOptions = {};
		options.listeners = {
			stdout: (data: Buffer) => {
				ret += data.toString();
			}
		}

		await exec.exec(cmdLine[0], cmdLine.splice(1), options);

		return ret;
	}

	private processOutput(output: string) {
		let result: string = null;

		let curIdx: number = 0;
		while (curIdx < output.length) {
			const foundStart: number = output.indexOf(HeadlessResult.XANITIZER_MESSAGE_PFIX, curIdx);
			if (foundStart === -1) {
				// Prefix not found.
				break;
			}

			const foundEnd: number = output.indexOf(HeadlessResult.XANITIZER_MESSAGE_SUFFIX, foundStart);
			if (foundEnd === -1) {
				// Suffix not found.
				break;
			}

			// Parse: <prop>:<message>
			const msg: string = output.substring(foundStart + HeadlessResult.XANITIZER_MESSAGE_PFIX.length, foundEnd);

			const colonPos: number = msg.indexOf(':');
			if (colonPos !== -1) {
				const prop: string = msg.substring(0, colonPos);
				const detailMsg: string = msg.substring(colonPos + 1);

				if (prop == HeadlessProperty[HeadlessProperty.RESULT]) {
					result = detailMsg;
				}
			}

			// Jump behind last match.
			curIdx = foundEnd + HeadlessResult.XANITIZER_MESSAGE_SUFFIX.length;
		}

		// No finished message if haltOnXYZ was specified.
		if (result == null
			&& result != HeadlessResult.XANITIZER_BATCH_SUCCESFULL) {
			throw new Error("Xanitizer batch run does not finished successfully!");
		}
	}

	protected getBooleanParameter(value: string, defaultValue: boolean): boolean {
		if (value == null || value.length === 0) {
			return defaultValue;
		}

		return value == 'true';
	}

	protected getNumberParameter(value: string, defaultValue: number, parameter: string): number {
		if (value == null || value.length === 0) {
			return defaultValue;
		}

		const ret: number = Number.parseFloat(value);

		if (Number.isNaN(ret)) {
			throw new Error(`Parameter '${parameter}' can not be parsed as a number.`);
		}

		return ret;
	}

}