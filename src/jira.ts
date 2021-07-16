import JiraApi = require('jira-client');
import * as t from "io-ts";
import { fromEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { toError } from 'fp-ts/lib/Either';
import { errorsToReadableMessages } from '@pagopa/ts-commons/lib/reporters';

export const jiraApi = new JiraApi(
    { host: "pagopa.atlassian.net", username: process.env.JIRA_USERNAME, password: process.env.JIRA_TOKEN }
);

export const JiraIssueTypeName = t.union([t.literal("Story"), t.literal("Epic"), t.literal("Bug"), t.literal("Task")]);
export type JiraIssueTypeName = t.TypeOf<typeof JiraIssueTypeName>;

export const JiraIssueResponse = t.exact(t.interface({
    fields: t.interface({
        key: t.string,
        summary: t.string,
        issuetype: t.union([
            t.interface({
                name: JiraIssueTypeName
            }), 
            t.interface({
                name: t.string,
                subtask: t.literal(true)
            })
        ]),
        project: t.interface({
            name: t.string
        })    
    })
}));

export type JiraIssueResponse = t.TypeOf<typeof JiraIssueResponse>;

export const getJiraIssue = (id: string) =>
    tryCatch(
        () => jiraApi.getIssue(id),
        toError
    )
    .chain(_ => 
        fromEither(
            JiraIssueResponse.decode(_).mapLeft(
                errs => new Error(`Cannot decode Response|${errorsToReadableMessages(errs).join("/")}`)
            )
        )
    );
