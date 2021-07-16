"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JiraApi = require("jira-client");
const t = require("io-ts");
const TaskEither_1 = require("fp-ts/lib/TaskEither");
const Either_1 = require("fp-ts/lib/Either");
const reporters_1 = require("@pagopa/ts-commons/lib/reporters");
exports.jiraApi = new JiraApi({ host: "pagopa.atlassian.net", username: process.env.JIRA_USERNAME, password: process.env.JIRA_TOKEN });
exports.JiraIssueTypeName = t.union([t.literal("Story"), t.literal("Epic"), t.literal("Bug"), t.literal("Task")]);
exports.JiraIssueResponse = t.exact(t.interface({
    fields: t.interface({
        key: t.string,
        summary: t.string,
        issuetype: t.union([t.interface({
                name: t.union([t.literal("Story"), t.literal("Epic"), t.literal("Bug"), t.literal("Task")])
            }), t.interface({
                name: t.string,
                subtask: t.literal(true)
            })]),
        project: t.interface({
            name: t.string
        })
    })
}));
exports.getJiraIssue = (id) => TaskEither_1.tryCatch(() => exports.jiraApi.getIssue(id), Either_1.toError)
    .chain(_ => TaskEither_1.fromEither(exports.JiraIssueResponse.decode(_).mapLeft(errs => new Error(`Cannot decode Response|${reporters_1.errorsToReadableMessages(errs).join("/")}`))));
