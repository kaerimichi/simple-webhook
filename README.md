# Simple Webhook

This is a very neat API which performs a pretty ordinary task: update your worktree within a folder when you do a `git push`.

## Configuration

There's a `sample.env` in the main directory which should be copied as a `.env` file.

```
$ cp sample.env .env
```

You should edit this file and change the parameters to match your needs. Basically, in your dotenv file, you'll change:

* USER_ALIAS to your Bitbucket username or company alias;
* DEPLOY_DIR to your local (by "local" I mean: in the server which you're running the service, of course) where you've cloned the repository (e. g. '/opt');
* DEFAULT_BRANCH to a branch to be pulled when you push something to the repo;
* APPLICATION_PORT to a port where your Node application should listen;
* DEFAULT_GROUP (optional) to a default group to run the Node process;
* DEFAULT_USER (optional) to a default group to run the Node process.

These two last parameters are useful if you run the application as a daemon.

## Usage

Start the API by typing `npm start`. You can also run the service as a daemon if you prefer, by using [forever-service](https://github.com/zapty/forever-service).

## API Endpoint

In Bitbucket, you should POST to the following endpoint: `/deploy/{project_folder}`. Where `project_folder` is the folder of your cloned project (e. g. '/opt/project').
