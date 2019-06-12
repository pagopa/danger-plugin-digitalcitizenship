"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const danger_plugin_yarn_1 = require("danger-plugin-yarn");
const utils_1 = require("./utils");
const MAX_LINES_OF_CODE = 250;
function checkDangers() {
    const prTitle = danger.github.pr.title;
    const pivotalStories = utils_1.getPivotalStoryIDs(prTitle);
    // Pull Requests should reference a Pivotal Tracker story
    if (pivotalStories.length === 0) {
        warn("Please include a Pivotal story at the beginning of the PR title (see below).");
        markdown(`
  Example of PR titles that include pivotal stories:

  * single story: \`[#123456] my PR title\`
  * multiple stories: \`[#123456,#123457,#123458] my PR title\`

    `);
    }
    else {
        const p = utils_1.getPivotalStories(pivotalStories).then(stories => {
            markdown(`
## Affected stories

${stories.map(s => `  * ${utils_1.getEmojiForStoryType(s.story_type)} [#${s.id}](${s.url}): ${s.name}`).join("\n")}\n`);
        });
        schedule(p);
    }
    // Adds a remainder to remove the "WIP" wording
    if (utils_1.checkWIP(prTitle)) {
        warn("WIP keyword in PR title is deprecated, please create a Draft PR instead.");
    }
    // No PR is too small to include a description of why you made a change
    if (danger.github.pr.body.length < 10) {
        warn("Please include a description in the Pull Request.");
    }
    // Perform sanity checks on yarn.lock
    // See https://www.npmjs.com/package/danger-plugin-yarn
    schedule(danger_plugin_yarn_1.default());
    // Warn if npm lock files have been added
    const npmLockFiles = danger.git.fileMatch("package-lock.json", "npm-shrinkwrap.json");
    if (npmLockFiles.edited) {
        const npmLockFilesPaths = npmLockFiles.getKeyedPaths().edited.join(", ");
        warn(`NPM lock files [${npmLockFilesPaths}] have been added or modified, this is usually an error since we use YARN for package management.`);
    }
    const linesOfCodeChanged = danger.github.pr.additions + danger.github.pr.deletions;
    if (linesOfCodeChanged > MAX_LINES_OF_CODE) {
        warn(`This PR changes a total of ${linesOfCodeChanged} LOCs, that is more than a reasonable size of ${MAX_LINES_OF_CODE}. Consider splitting the pull request into smaller ones.`);
    }
}
exports.default = checkDangers;
