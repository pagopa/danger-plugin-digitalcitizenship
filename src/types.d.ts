declare namespace Pivotal {
  type StoryType = "feature" | "bug" | "chore" | "release";
  type StoryCurrentState = "accepted" | "delivered" | "finished" | "started" |
    "rejected" | "planned" | "unstarted" | "unscheduled";

  interface Story {
    id: string;
    story_type: StoryType;
    created_at: string;
    updated_at: string;
    estimate: number;
    name: string;
    current_state: StoryCurrentState;
    url: string;
    project_id: string;
  }
}

declare class Pivotal {
  constructor(token?: string);
  getStory(storyId: string, cb: (err: Error, story: Pivotal.Story) => void): void;
}

declare module "pivotaljs" {
  export = Pivotal;
}