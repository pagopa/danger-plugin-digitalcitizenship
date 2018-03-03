import Pivotal = require("pivotaljs");
/**
 * Extract the IDs of the Pivotal stories referenced in the message
 * see https://www.pivotaltracker.com/help/articles/githubs_service_hook_for_tracker/
 */
export declare function getPivotalStoryIDs(message: string): ReadonlyArray<string>;
/**
 * Fetches details about a Pivotal story
 */
export declare function getPivotalStory(id: string): Promise<Pivotal.Story>;
/**
 * Fetches details about an array of Pivotal stories
 */
export declare function getPivotalStories(ids: ReadonlyArray<string>): Promise<ReadonlyArray<Pivotal.Story>>;
export declare function getEmojiForStoryType(t: Pivotal.StoryType): string;
/**
 * Whether the message contains wording indicating a work in progress
 */
export declare function checkWIP(message: string): boolean;
