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

  // PR should reference a pivotal story
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

${stories.map(s => `  * ${getEmojiForStoryType(s.story_type)} [#${s.id}](${s.url}): ${s.name}`)}\n`);
    })
    schedule(p);
  }

  if(checkWIP(prTitle)) {
    warn(
      "Remember to fix the PR title by removing WIP wording when ready"
    );
  }

  // No PR is too small to include a description of why you made a change
  if (danger.github.pr.body.length < 10) {
    warn("Please include a description of your PR changes.");
  }

  // Check if package.json changed but not yarn.lock
  const packageJsonChanged = danger.git.modified_files.find(
    file => file === "package.json"
  );
  const yarnLockChanged = danger.git.modified_files.find(
    file => file === "yarn.lock"
  );
  if (packageJsonChanged && !yarnLockChanged) {
    const message = "Changes were made to package.json, but not to yarn.lock";
    const idea = "Perhaps you need to run `yarn install`?";
    warn(`${message} - <i>${idea}</i>`);
  }
}
