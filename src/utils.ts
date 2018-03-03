import Pivotal = require("pivotaljs");

/**
 * Extract the IDs of the Pivotal stories referenced in the message
 * see https://www.pivotaltracker.com/help/articles/githubs_service_hook_for_tracker/
 */
export function getPivotalStoryIDs(message: string): ReadonlyArray<string> {
  const matches = message.match(/^\[(#\d+(,#\d+)*)\]\s.+/);
  if(matches) {
    return matches[1]
      .split(",")
      .map(id => id.slice(1))
  } else {
    return [];
  }
}

/**
 * Fetches details about a Pivotal story
 */
export function getPivotalStory(id: string): Promise<Pivotal.Story> {
  const pivotal = new Pivotal();
  return new Promise((res, rej) => {
    pivotal.getStory(id, (err, story) => {
      if(err) {
        return rej(err);
      }
      res(story);
    })
  });
}

/**
 * Fetches details about an array of Pivotal stories
 */
export function getPivotalStories(ids: ReadonlyArray<string>): Promise<ReadonlyArray<Pivotal.Story>> {
  return Promise.all(ids.map(getPivotalStory));
}

const STORY_EMOJIS = {
  "feature": "🌟",
  "bug": "🐞",
  "chore": "⚙️",
  "release": "🏁"
};

export function getEmojiForStoryType(t: Pivotal.StoryType): string {
  return STORY_EMOJIS[t] || "";
}

/**
 * Whether the message contains wording indicating a work in progress
 */
export function checkWIP(message: string): boolean {
  return message.match(/(WIP|work in progress)/i) !== null;
}
