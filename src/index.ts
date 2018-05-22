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
      "Remember to fix the PR title by removing WIP wording when ready"
    );
  }

  // No PR is too small to include a description of why you made a change
  if (danger.github.pr.body.length < 10) {
    warn("Please include a description of your PR changes.");
  }

  // Permorm sanity checks on yarn.lock
  // See https://www.npmjs.com/package/danger-plugin-yarn
  schedule(yarn());

}
