import React from "react";
import Authentication from "../Authentication/Authentication";
import ConfigContainer from "./ConfigContainer/ConfigContainer";
import "./Config.css";

export default class ConfigPage extends React.Component {
    constructor(props) {
        super(props);
        this.Authentication = new Authentication();

        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.state = {
            finishedLoading: false,
            theme: "light",
            player: { token: "" },
        };
    }

    contextUpdate(context, delta) {
        if (delta.includes("theme")) {
            this.setState(() => {
                return { theme: context.theme };
            });
        }
    }

    componentDidMount() {
        // do config page setup as needed here
        if (this.twitch) {
            this.twitch.onAuthorized(async (auth) => {
                this.Authentication.setToken(auth.token, auth.userId);
                if (!this.state.finishedLoading) {
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.
                    await this.getConfig(auth.token, auth.userId);

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    this.setState(() => {
                        return { finishedLoading: true };
                    });
                }
            });

            this.twitch.onContext((context, delta) => {
                this.contextUpdate(context, delta);
            });
        }
    }

    async fetchConfig(token, userId) {
        try {
            const response = await fetch(
                `https://startgg.profile.smartjobsite.com/api/users/${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.json();
        } catch (error) {
            return null;
        }
    }

    async createConfig(token, userId, startggToken) {
        try {
            let body = {
                twitchUserId: userId,
                startggToken: startggToken,
            };
            const response = await fetch(`https://startgg.profile.smartjobsite.com/api/users/`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            return response.json();
        } catch (error) {
            return null;
        }
    }

    async updateConfig(token, userId, startggToken) {
        try {
            let body = {
                twitchUserId: userId,
                startggToken: startggToken,
            };

            const response = await fetch(
                `https://startgg.profile.smartjobsite.com/api/users/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );
            return response.json();
        } catch (error) {
            return null;
        }
    }

    async getConfig(token, userId) {
        const config = await this.fetchConfig(token, userId);
        if (config != null) {
            if (config.msg == null) {
                const startggToken = this.parseJwt(config.token).startggToken;
                this.setState(() => {
                    return {
                        player: {
                            token: startggToken,
                        },
                    };
                });
            }
        }
    }

    parseJwt(token) {
        var base64Url = token.split(".")[1];
        var base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    }

    saveConfig(player) {
        if (this.state.player.token == "") {
            this.twitch.onAuthorized(async (auth) => {
                this.Authentication.setToken(auth.token, auth.userId);
                await this.createConfig(auth.token, auth.userId, player.token);
            });
        } else {
            this.twitch.onAuthorized(async (auth) => {
                this.Authentication.setToken(auth.token, auth.userId);
                await this.updateConfig(auth.token, auth.userId, player.token);
            });
        }

        this.state.player = player;
    }

    render() {
        if (this.state.finishedLoading && this.Authentication.isModerator()) {
            return (
                <div className="Config">
                    <div
                        className={
                            this.state.theme === "light"
                                ? "Config-light"
                                : "Config-dark"
                        }
                    >
                        <ConfigContainer
                            theme={this.state.theme}
                            player={this.state.player}
                            saveConfig={(player) => this.saveConfig(player)}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    className={
                        this.state.theme === "light"
                            ? "App App-light"
                            : "App App-dark"
                    }
                >
                    <div className="spinner"></div>
                </div>
            );
        }
    }
}
