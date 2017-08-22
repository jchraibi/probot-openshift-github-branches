const openShiftConfigLoader = require('openshift-config-loader');
const openShiftRestClient = require('openshift-rest-client');
const util = require('util');

//const ocConfig = openShiftConfigLoader({configLocation:'openshift-config.json'});

//Added by Jaafar
var ocSettings =
{ apiVersion: 'v1',
  context:
  { cluster: '192-168-1-84:8443',
    namespace: 'ocprobot',
    user: 'admin/192-168-1-84:8443' },
  user: { token: 'GjXMp0f-saxi2NsenHSnE-GR5TEQU67bBwwErg5DXR8' },
  cluster: 'https://192.168.1.84:8443' };

//const ocRest = openShiftRestClient(ocConfig);
const ocRest = openShiftRestClient(ocSettings);

/*
Async function deploy_complete(event, context, owner, repoName) {
  const ref = event.payload.deployment.ref;
  context.github.repos.createDeploymentStatus({
    owner,
    repo:repoName,
    id:event.payload.deployment.id, state:'success', environment_url:'https://' + ref.substring(1) + '-openshift.com'});
}
*/
module.exports = {
  async pr_opened(event) {
    console.log('os pr(', event.payload.number, ') was', event.payload.action, ': ', event.payload.pull_request.title);
    console.log('create OpenShift service now!');
    console.log(util.inspect(ocRest));

  const buildConfig = {
    apiVersion: 'v1',
    kind: 'BuildConfig',
    metadata: {
      name: 'toto1',
      namespace: 'ocprobot'
    },
    spec: {
      nodeSelector: null,
      output: {
        to: {
          kind: "ImageStreamTag",
          name: "nodejs-mongodb-example:latest"
        }
      },
      postCommit: {
        script: "npm test"
      },
      resources: {},
      runPolicy: "Serial",
      source: {
        git: {
          uri: "https://github.com/openshift/nodejs-ex.git"
        },
        type: "Git"
      },
      strategy: {
        sourceStrategy: {
          env: [
            {
              name: "NPM_MIRROR"
            }
          ],
          from: {
            kind: "ImageStreamTag",
            name: "nodejs:6",
            namespace: "openshift"
          }
        },
        type: "Source"
      }
    }
  };

    ocRest.then((client) => {
      // Use the client object to find a list of projects, for example
      client.projects.find().then((projects) => {
        console.log(JSON.stringify(projects));
      });

  client.buildconfigs.create(buildConfig).then((bc) => {
    console.log(JSON.stringify(bc));
  });

  myproject =
  {
    "apiVersion": "v1",
    "kind": "Project",
    "metadata": {
      "annotations": {
        "openshift.io/description": "",
        "openshift.io/display-name": "",
      },
      "name": "myproject",
    },
    "spec": {
      "finalizers": [
        "openshift.io/origin",
        "kubernetes"
      ]
    }
  };

/*
    client.projects.create(myproject).then((prj) => {
      console.log(JSON.stringify(prj));
    });
*/

  // Jaafar - Test Create a buildconfig
/*
    client.buildconfigs.create(buildConfig).then((buildconfig) => {
    });
*/

});
  /*  OcRest.deploymentconfigs.create({}, {}).then(dc => {
      console.log(util.inspect(dc, false, null));
    }); */

},
  async pr_reopened(event) {
    this.pr_opened(event);
  },
  async pr_commits() {},
  async pr_closed(event) {
    const merged = event.payload.pull_request.merged;
    console.log('pr(', event.payload.number, ') was ', event.payload.action, '(merged:', event.payload.pull_request.merged, '): ', event.payload.pull_request.title);
    if (merged) {
      await this.pr_merge();
    } else {
      console.log('destroy OpenShift service now!');
    }
  },
  async pr_merge() {
    console.log('OpenShift should start the deployment now');
  },
  async deploy() {
    console.log('OpenShift should start the deployment now');
  }
};

// Create service on
