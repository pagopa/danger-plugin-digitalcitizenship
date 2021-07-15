import yarn from "danger-plugin-yarn";

// Provides dev-time typing structure for  `danger` - doesn't affect runtime.
import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL"
import { JiraIssueTypeName } from "./jira";
declare var danger: DangerDSLType

export declare function message(message: string): void
export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void
export declare function schedule<T>(asyncFunction: Promise<T>): void;

import { getJiraIssues, getJiraIDs, checkWIP, getEmojiForIssueType } from "./utils";

const MAX_LINES_OF_CODE = 250;
const JIRA_BROWSE_URL = "https://pagopa.atlassian.net/browse/"

export default function checkDangers() {
  const prTitle = danger.github.pr.title;
  const jiraIds = getJiraIDs(prTitle);

  // Pull Requests should reference a Jira Issue
  if (jiraIds.length === 0) {
    warn(
      "Please include a Jira Ticket at the beginning of the PR title (see below)."
    );
    markdown(`
  Example of PR titles that include Jira tickets:

  * single ticket: \`[#ES-234] my PR title\`
  * multiple tickets: \`[#ES-234,#ES-235,#ES-236] my PR title\`

    `);
  } else {
    const p = getJiraIssues(jiraIds).then(tickets => {
      markdown(`
## Affected Ticket

${tickets.map(s => `  * ${JiraIssueTypeName.is(s.fields.issuetype.name) ? getEmojiForIssueType(s.fields.issuetype.name) : s.fields.issuetype.name} [#${s.fields.key}](${JIRA_BROWSE_URL}${s.fields.key}): ${s.fields.summary}`).join("\n")}\n`);
    })
    schedule(p);
  }

  // Adds a remainder to remove the "WIP" wording
  if(checkWIP(prTitle)) {
    warn(
      "WIP keyword in PR title is deprecated, please create a Draft PR instead."
    );
  }

  // No PR is too small to include a description of why you made a change
  if (danger.github.pr.body.length < 10) {
    warn("Please include a description in the Pull Request.");
  }

  // Perform sanity checks on yarn.lock
  // See https://www.npmjs.com/package/danger-plugin-yarn
  schedule(yarn());

  // Warn if npm lock files have been added
  const npmLockFiles = danger.git.fileMatch("package-lock.json", "npm-shrinkwrap.json");
  if(npmLockFiles.edited) {
    const npmLockFilesPaths = npmLockFiles.getKeyedPaths().edited.join(", ");
    warn(
      `NPM lock files [${npmLockFilesPaths}] have been added or modified, this is usually an error since we use YARN for package management.`
    );
  }

  const linesOfCodeChanged = danger.github.pr.additions + danger.github.pr.deletions;
  if(linesOfCodeChanged > MAX_LINES_OF_CODE) {
    warn(`This PR changes a total of ${linesOfCodeChanged} LOCs, that is more than a reasonable size of ${MAX_LINES_OF_CODE}. Consider splitting the pull request into smaller ones.`)
  }
}
