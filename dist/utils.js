"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWIP = exports.getEmojiForStoryType = exports.getPivotalStories = exports.getPivotalStory = exports.getPivotalStoryIDs = void 0;
const Pivotal = require("pivotaljs");
/**
 * Extract the IDs of the Pivotal stories referenced in the message
 * see https://www.pivotaltracker.com/help/articles/githubs_service_hook_for_tracker/
 */
function getPivotalStoryIDs(message) {
    const matches = message.match(/^\[(#\d+(,#\d+)*)\]\s.+/);
    if (matches) {
        return matches[1]
            .split(",")
            .map(id => id.slice(1));
    }
    else {
        return [];
    }
}
exports.getPivotalStoryIDs = getPivotalStoryIDs;
/**
 * Fetches details about a Pivotal story
 */
function getPivotalStory(id) {
    const pivotal = new Pivotal();
    return new Promise((res, rej) => {
        pivotal.getStory(id, (err, story) => {
            if (err) {
                return rej(err);
            }
            res(story);
        });
    });
}
exports.getPivotalStory = getPivotalStory;
/**
 * Fetches details about an array of Pivotal stories
 */
function getPivotalStories(ids) {
    return Promise.all(ids.map(getPivotalStory));
}
exports.getPivotalStories = getPivotalStories;
const STORY_EMOJIS = {
    "feature": "🌟",
    "bug": "🐞",
    "chore": "⚙️",
    "release": "🏁"
};
function getEmojiForStoryType(t) {
    return STORY_EMOJIS[t] || "";
}
exports.getEmojiForStoryType = getEmojiForStoryType;
/**
 * Whether the message contains wording indicating a work in progress
 */
function checkWIP(message) {
    return message.match(/(WIP|work in progress)/i) !== null;
}
exports.checkWIP = checkWIP;
