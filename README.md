# START.GG - PROFILE

This project is a twitch extension to show results from your tournaments on start.gg.

**Install latest release [here](https://dashboard.twitch.tv/extensions/ksjaek493w0o9wdyfg7ud45pve0ec4-0.0.2)**

## Contributing

Pull requests are always welcome 😃.
**But please do not fork / clone the repo to post a clone on twitch extension dashboard.**

## Requirements

There is only one requirement.

* Node.JS LTS or greater.

You may also find that using `yarn` is easier than `npm`, so we do recommend installing that as well by running:

```bash
npm i -g yarn
```

in an elevated command line interface.

## Usage

To build your finalized React JS files, simply run `yarn build` to build the various webpacked files.

### Commands

* Run `yarn start` to start the developement server without developer rig support
* Run `yarn host` to start the developement server without developer rig support

## File Structure

The file structure in the template is laid out with the following:

### bin

The `/bin` folder holds the cert generation script.

### conf

The `/conf` folder holds the generated certs after the cert generation script runs.

### dist

`/dist` holds the final JS files after building.

### public

`/public` houses the static HTML files used for your code's entrypoint.

### src

This folder houses all source code and relevant files (such as images). Each React class/component is given a folder to house all associated files (such as associated CSS).

Below this folder, the structure is much simpler.

This would be:

```bash
components
-\App
--\App.js
--\App.test.js
--\App.css
-\Authentication
--\Authentication.js
...
```

Each component is under the `components` folder.

## To do

* Refactor the profile main display panel with MUI front-end framework like configuration panel.
* Add option on configuration panel to choose the results we want to show.
* Add option on configuration panel to choose the number of results we want to show.

## LICENSE

[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/)