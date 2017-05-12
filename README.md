# spacepipe
Spacepipe makes it easy to wrap Meteor apps into production-ready docker containers


## Using spacepipe locally
Look at examples/todo. The only thing you need to do before docker building is adding two npm script lines to package.json:

    "scripts": {
      "build": "spacepipe fire",
      "meteorbuild": "meteor build **--directory .build;exit 0**",
    },

After, just enter "npm run build" and see the things go wild.
If you call it with additional docker tags: "npm run build private.registry.localhost/repository:tag", spacepipe will try to push the image to the registry at the end.

If you added a "test" npm script, that one will be run before building in a isolated environment.

## Using spacepipe in a ci environment with only docker installed
**Spacepipe only needs docker installed to work in CI mode. All node & meteor specific tasks are run inside docker containers.**

Add a Dockerfile with this content to the root of your app:
    FROM pozylon/spacepipe

Run
    docker build .


## Planned features

- Customize all Dockerfiles used in the spacepipe operations through .rc defined files
- Add spacepipe init: Generate script lines, docker-compose files and docker engine config (.rc) automatically for deployment
- Add spacepipe jenkins: Generate Dockerfile & Jenkinsfile
- Add spacepipe deploy and spacepipe fire --deploy
