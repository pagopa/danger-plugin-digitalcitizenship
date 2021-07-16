"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jira_1 = require("./jira");
const Array_1 = require("fp-ts/lib/Array");
const TaskEither_1 = require("fp-ts/lib/TaskEither");
const function_1 = require("fp-ts/lib/function");
/**
 * Extract the IDs of the Pivotal stories referenced in the message
 * see https://www.pivotaltracker.com/help/articles/githubs_service_hook_for_tracker/
 */
function getJiraIDs(message) {
    const matches = message.match(/^\[(#\D+\d+(,#\d+)*)\]\s.+/);
    if (matches) {
        return matches[1]
            .split(",")
            .map(id => id.slice(1));
    }
    else {
        return [];
    }
}
exports.getJiraIDs = getJiraIDs;
/**
 * Fetches details about an array of Pivotal stories
 */
function getJiraIssues(ids) {
    return Array_1.array.sequence(TaskEither_1.taskEither)(ids.map(id => jira_1.getJiraIssue(id))).fold(() => [], function_1.identity).run();
}
exports.getJiraIssues = getJiraIssues;
const TICKET_EMOJIS = {
    "Story": "🌟",
    "Bug": "🐞",
    "Task": "⚙️",
    "Epic": "🏁"
};
function getEmojiForIssueType(t) {
    return TICKET_EMOJIS[t] || "";
}
exports.getEmojiForIssueType = getEmojiForIssueType;
/**
 * Whether the message contains wording indicating a work in progress
 */
function checkWIP(message) {
    return message.match(/(WIP|work in progress)/i) !== null;
}
exports.checkWIP = checkWIP;
