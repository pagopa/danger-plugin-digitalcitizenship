import JiraApi = require('jira-client');
import * as t from "io-ts";
export declare const jiraApi: JiraApi;
export declare const JiraIssueTypeName: t.UnionC<[t.LiteralC<"Story">, t.LiteralC<"Epic">, t.LiteralC<"Bug">, t.LiteralC<"Task">]>;
export declare type JiraIssueTypeName = t.TypeOf<typeof JiraIssueTypeName>;
export declare const JiraIssueResponse: t.ExactC<t.TypeC<{
    fields: t.TypeC<{
        key: t.StringC;
        summary: t.StringC;
        issuetype: t.UnionC<[t.TypeC<{
            name: t.UnionC<[t.LiteralC<"Story">, t.LiteralC<"Epic">, t.LiteralC<"Bug">, t.LiteralC<"Task">]>;
        }>, t.TypeC<{
            name: t.StringC;
            subtask: t.LiteralC<true>;
        }>]>;
        project: t.TypeC<{
            name: t.StringC;
        }>;
    }>;
}>>;
export declare type JiraIssueResponse = t.TypeOf<typeof JiraIssueResponse>;
export declare const getJiraIssue: (id: string) => import("fp-ts/lib/TaskEither").TaskEither<Error, {
    fields: {
        key: string;
        summary: string;
        issuetype: {
            name: "Task" | "Story" | "Epic" | "Bug";
        } | {
            name: string;
            subtask: true;
        };
        project: {
            name: string;
        };
    };
}>;
