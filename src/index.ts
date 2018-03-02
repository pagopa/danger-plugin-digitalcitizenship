// Provides dev-time typing structure for  `danger` - doesn't affect runtime.
import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL"
declare var danger: DangerDSLType

export declare function message(message: string): void
export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void

function checkPivotalStoryRef(message: string): boolean {
  // see https://www.pivotaltracker.com/help/articles/githubs_service_hook_for_tracker/
  return message.match(/^\[#\d+(,#\d+)*\]\s.+/) !== null;
}

export default function checkDangers() {

  // PR should reference a pivotal story
  if (!checkPivotalStoryRef(danger.github.pr.title)) {
    warn(
      "Please include a Pivotal story at the beginning of the PR title (see below)."
    );
    markdown(`
  Example of PR titles that include pivotal stories:

  * single story: \`[#123456] my PR title\`
  * multiple stories: \`[#123456,#123457,#123458] my PR title\`

    `);
  }

  // No PR is too small to include a description of why you made a change
  if (danger.github.pr.body.length < 10) {
    warn("Please include a description of your PR changes.");
  }

}
