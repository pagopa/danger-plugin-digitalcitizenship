"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkPivotalStoryRef(message) {
    // see https://www.pivotaltracker.com/help/articles/githubs_service_hook_for_tracker/
    return message.match(/^\[#\d+(,#\d+)*\]\s.+/) !== null;
}
function checkDangers() {
    // PR should reference a pivotal story
    if (!checkPivotalStoryRef(danger.github.pr.title)) {
        warn("Please include a Pivotal story at the beginning of the PR title (see below).");
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
exports.default = checkDangers;
