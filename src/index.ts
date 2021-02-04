import yarn from "danger-plugin-yarn";

// Provides dev-time typing structure for  `danger` - doesn't affect runtime.
import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL"
declare var danger: DangerDSLType

export declare function message(message: string): void
export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void
export declare function schedule<T>(asyncFunction: Promise<T>): void;

import { getPivotalStories, getPivotalStoryIDs, checkWIP, getEmojiForStoryType } from "./utils";

const MAX_LINES_OF_CODE = 250;

export default function checkDangers() {
  const prTitle = danger.github.pr.title;
  const pivotalStories = getPivotalStoryIDs(prTitle);

  // Pull Requests should reference a Pivotal Tracker story
  if (pivotalStories.length === 0) {
    warn(
      "Please include a Pivotal story at the beginning of the PR title (see below)."
    );
    markdown(`
  Example of PR titles that include pivotal stories:

  * single story: \`[#123456] my PR title\`
  * multiple stories: \`[#123456,#123457,#123458] my PR title\`

    `);
  } else {
    const p = getPivotalStories(pivotalStories).then(stories => {
      markdown(`
## Affected stories

${stories.map(s => `  * ${getEmojiForStoryType(s.story_type)} [#${s.id}](${s.url}): ${s.name}`).join("\n")}\n`);
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

  // Warn if we spelled pagoPA wrong :)
  const markdownFiles = danger.git.modified_files.filter(f => f.endsWith(".md"));
  markdownFiles.forEach(async (f) => {
    const diff = await danger.git.diffForFile(f);

    const matches = diff?.added?.match(/PagoPA|Pagopa|PagoPa|pagopa/);
    if (matches) {
      warn(`${f}: expected spelling "pagoPA", found "${matches[0]}". Please use "pagoPA" unless you're referring to "PagoPA S.p.A."`);
    }
  });
}
