import Pivotal = require("pivotaljs");
import { getJiraIssue, JiraIssueResponse, JiraIssueTypeName } from "./jira";
import { array } from "fp-ts/lib/Array";
import { taskEither } from "fp-ts/lib/TaskEither";
import { identity } from "fp-ts/lib/function";

/**
 * Extract the IDs of the JIRA ticket referenced in the message
 * see https://www.pivotaltracker.com/help/articles/githubs_service_hook_for_tracker/
 */
export function getJiraIDs(message: string): ReadonlyArray<string> {
  // This regex matches all strings of type:
  // - [#ES-234] PR Title (for a single linked issue)
  // - [#ES-234,#ES-235,#ES-236] PR Title (for multiple linked issues)
  const matches = message.match(/^\[(#\D+\d+(,#\d+)*)\]\s.+/);
  if(matches) {
    return matches[1]
      .split(",")
      .map(id => id.slice(1))
  } else {
    return [];
  }
}
/**
 * Fetches details about an array of Pivotal stories
 */
export function getJiraIssues(ids: ReadonlyArray<string>): Promise<ReadonlyArray<JiraIssueResponse>> {
  return array.sequence(taskEither)(
    ids.map(id => getJiraIssue(id))
  )
  .getOrElse([])
  .run();
}

const TICKET_EMOJIS = {
  "Story": "🌟",
  "Bug": "🐞",
  "Task": "⚙️",
  "Epic": "🏁"
};

export function getEmojiForIssueType(t: JiraIssueTypeName) {
  return TICKET_EMOJIS[t] || "";
}

/**
 * Whether the message contains wording indicating a work in progress
 */
export function checkWIP(message: string): boolean {
  return message.match(/(WIP|work in progress)/i) !== null;
}
