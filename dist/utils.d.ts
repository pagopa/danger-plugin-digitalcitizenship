import { JiraIssueResponse, JiraIssueTypeName } from "./jira";
/**
 * Extract the IDs of the Pivotal stories referenced in the message
 * see https://www.pivotaltracker.com/help/articles/githubs_service_hook_for_tracker/
 */
export declare function getJiraIDs(message: string): ReadonlyArray<string>;
/**
 * Fetches details about an array of Pivotal stories
 */
export declare function getJiraIssues(ids: ReadonlyArray<string>): Promise<ReadonlyArray<JiraIssueResponse>>;
export declare function getEmojiForIssueType(t: JiraIssueTypeName): string;
/**
 * Whether the message contains wording indicating a work in progress
 */
export declare function checkWIP(message: string): boolean;
