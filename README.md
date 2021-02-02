# Custom DangerJS rules plugin
Custom rules over [Danger](https://danger.systems/js/) CI automation.
## Features
* Cross-link with [PivotalTracker](https://www.pivotaltracker.com/) stories, based on PR title
* Warn when a PR has no description
* Perform sanity checks on yarn.lock
* Warn if `npm`-related files are added (as we use `yarn`)
