# `xanitizer-action`

The `xanitizer-action` runs a security analysis in a GitHub workflow using [Xanitizer](https://www.xanitizer.com)
to automatically detect vulnerabilities in your code by:

- Downloading and installing the latest version of Xanitizer.
- Running a security analysis with default or with project specific settings.
- Optionally breaking the build in case of e.g. some finding has a rating that is equal or larger than a defined value.
- Exporting the detected vulnerabilties as report files
  which can optionally be archived using the `actions/upload-artifact` action
  or uploaded via the `github/codeql-action/upload-sarif` action
  into the GitHub code scanning alert section of your repository.


## License

This project is released under the
[MIT License](https://github.com/RIGS-IT/xanitizer-action/blob/master/LICENSE).

The underlying Xanitizer, used in this action, is licensed under the 
[Xanitizer End-User Clickwrap License Aggreement](https://www.xanitizer.com/xanitizer-license-agreement/)
and needs a separate license file.
Licenses are free of charge for open source projects and for educational usage.
To get more information about the Xanitizer licenses and how to obtain a license file, 
please consult [Licensing and Pricing](https://www.xanitizer.com/xanitizer-pricing/).


## Prerequisites

To use this `xanitizer-action` in a GitHub workflow, some prerequisites have to be fullfilled.

### Xanitizer license

Xanitizer needs a license file to be executed.
For this, the content of the license file has to be stored as a GitHub secret, e.g. `XANITIZER_LICENSE` inside the repository settings
([Creating and storing encrypted secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets)).
After storing the content as a GitHub secret, the license can be referenced like this:

```yaml
- uses: RIGS-IT/xanitizer-action@v1
  with:
    license: ${{ secrets.XANITIZER_LICENSE }}
```

### Prerequisite for Java Projects

Xanitizer needs a compiled Java project, because Xanitizer does not only look at the source code,
but it primarily analyzes the byte code.
As a static application security testing (SAST) tool, Xanitizer requires that all dependencies of analyzed
artifacts can be successfully resolved.
So you have to compile your project before running the security analysis, e.g. via Maven:

```yaml
  # Compile the code for Java projects and get all libraries, e.g. via Maven
- run: mvn -B compile

  # Run the security analysis with default settings
- name: Xanitizer Security Analysis
  uses: RIGS-IT/xanitizer-action@v1
  with:
    license: ${{ secrets.XANITIZER_LICENSE }}
```

### Prerequisite for JavaScript Projects

Xanitizer requires that all dependencies of artifacts being analyzed can be successfully resolved.
To support this all used libraries have to be installed before running the security analysis, e.g. via `npm install`:

```yaml
  # Install all dependend libraries for JavaScript/TypeScript project, e.g. via npm
- run: npm install

  # Run the security analysis with default settings
- name: Xanitizer Security Analysis
  uses: RIGS-IT/xanitizer-action@v1
  with:
    license: ${{ secrets.XANITIZER_LICENSE }}
```


## Usage

This action can be run on `ubuntu-latest` and `windows-latest` GitHub Actions runners.

An example workflow which runs a Xanitizer security analysis 
and then archives the findings list reports 
and uploads the findings into the GitHub code scanning alert section of your repository
can be found [here](https://github.com/RIGS-IT/xanitizer-action/blob/master/workflows/xanitizer.yml).

### Basic

The basic configuration runs a security analysis with the Xanitizer default settings
and exports a `Xanitizer-Findings-List.pdf` and `Xanitizer-Findings-List.sarif` report 
containing all problematic findings with their details in the root directory of the repository that has been checked out.

```yaml
name: "Xanitizer Security Analysis"

on:
  # Run the workflow on each push
  # push:
  # Run the workflow each day at 5 am
  # schedule:
  #   - cron: '0 5 * * *'
  # Run the workflow manually
  workflow_dispatch:

jobs:
  xanitizer-security-analysis:
    # Xanitizer runs on ubuntu-latest and windows-latest.
    runs-on: ubuntu-latest

    steps:
      # Check out the repository
    - uses: actions/checkout@v2

      # Compile the code for Java projects and get all libraries, e.g. via Maven
    - run: mvn -B compile

      # Install all dependent libraries for JavaScript/TypeScript project, e.g. via npm
    - run: npm install

      # Run the security analysis with default settings
    - name: Xanitizer Security Analysis
      uses: RIGS-IT/xanitizer-action@v1
      with:
        license: ${{ secrets.XANITIZER_LICENSE }}
```

### Integration into the GitHub Code Scanning Alert Section 

In the basic configuration, Xanitizer exports a `Xanitizer-Findings-List.sarif` report 
containing all problematic findings with their details into the root directory of the repository that has been checked out.
This exported SARIF file can be uploaded to the GitHub code scanning alert section of your repository
via the `github/codeql-action/upload-sarif` action.

```yaml
steps:
  # Check out the repository
- uses: actions/checkout@v2

  # Compile the code for Java projects and get all libraries, e.g. via Maven
- run: mvn -B compile

  # Install all dependent libraries for JavaScript/TypeScript project, e.g. via npm
- run: npm install

  # Run the security analysis with default settings
- name: Xanitizer Security Analysis
  uses: RIGS-IT/xanitizer-action@v1
  with:
    license: ${{ secrets.XANITIZER_LICENSE }}

  # Uploads results.sarif to GitHub using the upload-sarif action
- uses: github/codeql-action/upload-sarif@v1
  with:
    sarif_file: Xanitizer-Findings-List.sarif
```

### Exporting and Archiving Overview and Finding Lists Reports

If none of the parameters `overviewReportOutputFile`, `overviewReportOutputFiles`,
`findingsListReportOutputFile`, or `findingsListReportOutputFiles` are specified,
Xanitizer exports only a `Xanitizer-Findings-List.pdf` and `Xanitizer-Findings-List.sarif` report 
containing all problematic findings with their details into the root directory of the repository that has been checked out.

To export and archive an overview report or to export and archive a findings list report in another format, you can use:

```yaml
steps:
  # Check out the repository
- uses: actions/checkout@v2

  # Compile the code for Java projects and get all libraries, e.g. via Maven
- run: mvn -B compile

  # Install all dependent libraries for JavaScript/TypeScript project, e.g. via npm
- run: npm install

  # Run the security analysis with a configuration file
- name: Xanitizer Security Analysis
  uses: RIGS-IT/xanitizer-action@v1
  with:
    license: ${{ secrets.XANITIZER_LICENSE }}
    overviewReportOutputFile: relative/path/to/the/Overview-Report.pdf
    findingsListReportOutputFiles: relative/path/to/the/Findings-List.pdf,relative/path/to/the/Findings-List.html
    # Findings list reports have to contain also non problematic findings
    # onlyProblemsInFindingsListReport: false
    # Findings list reports contain no details e.g. all steps of a path
    # generateDetailsInFindingsListReport: false

  # Archiving
- uses: actions/upload-artifact@v2
  with:
    name: Xanitizer-Reports
    path: relative/path/to/the
```

Please note that the HTML report format is not only a single HTML file, it's a list of files with a subdirectory containing images.


### Configuration File

To improve the accuracy of the security analysis, 
the `xanitizer-action` can also be executed based on a Xanitizer configuration file containing project specific settings.
This configuration file can only be edited with the standalone version of Xanitizer not directly with the GitHub action.

```yaml
steps:
  # Check out the repository
- uses: actions/checkout@v2

  # Compile the code for Java projects and get all libraries, e.g. via Maven
- run: mvn -B compile

  # Install all dependent libraries for JavaScript/TypeScript project, e.g. via npm
- run: npm install

  # Run the security analysis with a configuration file
- name: Xanitizer Security Analysis
  uses: RIGS-IT/xanitizer-action@v1
  with:
    license: ${{ secrets.XANITIZER_LICENSE }}
    configFile: relative/path/to/the/configuration/file
```

### Another Checkout Path

It is possible to use the parameter `path` of the Git checkout action [`actions/checkout@v2`](https://github.com/actions/checkout#usage)
to check out the repository to a path under $GITHUB_WORKSPACE.
If this parameter is used, the corresponding parameter `checkoutPath` of this action `xanitizer-action`
has to be set to the same value.

```yaml
steps:
  # Check out the repository
- uses: actions/checkout@v2
  with:
    path: path/to/checkout

  # Compile the code for Java projects and get all libraries, e.g. via Maven
- run: |
    cd path/to/checkout
    mvn -B compile

  # Install all dependent libraries for JavaScript/TypeScript project, e.g. via npm
- run: |
    cd path/to/checkout
    npm install

  # Run the security analysis with default settings
- name: Xanitizer Security Analysis
  uses: RIGS-IT/xanitizer-action@v1
  with:
    license: ${{ secrets.XANITIZER_LICENSE }}
    checkoutPath: path/to/checkout
```

### Break the Build

Normally, Xanitizer will no break any build, unless the `xanitizer-action` is configured to do so.
Breaking the build is not recommended if the SARIF report file should be uploaded to the GitHub code scanning alert section of your repository,
because no SARIF report file is generated if the build breaks.

```yaml
steps:
  # Check out the repository
- uses: actions/checkout@v2

  # Compile the code for Java projects and get all libraries, e.g. via Maven
- run: mvn -B compile

  # Install all dependent libraries for JavaScript/TypeScript project, e.g. via npm
- run: npm install

  # Run the security analysis, breaking the build if necessary
- name: Xanitizer Security Analysis
  uses: RIGS-IT/xanitizer-action@v1
  with:
    license: ${{ secrets.XANITIZER_LICENSE }}
    # Whether the task should fail if in an exiting Xanitizer configuration file there are search paths configured that do not exist.
    # haltOnMissingSearchPaths: true
    # A comma - separated list of issue groups that will let the task fail if for any of them, a Xanitizer error issue occurs.
    # haltOnIssues: WORKSPACE_ERRORS, CALL_GRAPH_ERRORS, ANALYSIS_ERRORS, MIGRATION_ERRORS
    # Whether the task should fail if there are findings with a rating equal or higher than the value defined for `findingsRatingThreshold`.
    haltOnFindings: true
    # A rating value. Only used if the parameter `haltOnFindings` is set.
    findingsRatingThreshold: 5.0
```

## Inputs

See [action.yml](https://github.com/RIGS-IT/xanitizer-action/blob/master/action.yml) for all supported input parameters.

## Outputs

All output streams of the running Xanitizer installation will be redirected to the GitHub action logging framework.

Furthermore, the status messages containing i.a. the result of the security analysis are exported and can be used by subsequent steps
via the parameter `security_analysis`.

```yaml
steps:
  # Check out the repository
- uses: actions/checkout@v2

  # Compile the code for Java projects and get all libraries, e.g. via Maven
- run: mvn -B compile

  # Install all dependent libraries for JavaScript/TypeScript project, e.g. via npm
- run: npm install

  # Run the security analysis with default settings
- name: Xanitizer Security Analysis
  id: xanitizer
  uses: RIGS-IT/xanitizer-action@v1
  with:
    license: ${{ secrets.XANITIZER_LICENSE }}

  # Use the output from the `xanitizer` step
- run: echo "Status messages from Xanitizer's security analysis - ${{ steps.xanitizer.outputs.security_analysis }}"
```
