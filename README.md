# probot-openshift-github-branches
Probot-based plugin to enable advanced branch workflows between GitHub and OpenShift

## Key Functionality
* Creates Open Shift services for each Pull Request
  * Removes these services if the Pull Request is closed unmerged
  * Will recreate them if they are later reopened
* Start new deployments to Open Shift via [Deployment Events](https://developer.github.com/v3/repos/deployments/) from the Pull Request (not Push Events like the native Open Shift GitHub Webhook plugin)
  * Will only initialize deployments if all status checks succeed (optional)
* Updates the Pull Request with the Open Shift deployment status
* Uses the existing branch service to execute a Canary Deployment on Pull Request merge


Notes on deployment api
https://developer.github.com/v3/guides/automating-deployments-to-integrators/
