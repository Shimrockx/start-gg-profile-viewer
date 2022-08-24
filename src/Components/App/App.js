import React from "react";
import Authentication from "../Authentication/Authentication";

import ProfileContainer from "./ProfileContainer/ProfileContainer";
import "./App.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Typography } from "@mui/material";
let theme = createTheme({
    palette: {
        mode: "light",
    },
});

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.Authentication = new Authentication();

        this.anchor = this.queryParamParse().anchor;
        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.state = {
            configError: false,
            finishedLoading: false,
            theme: "light",
        };
    }

    queryParamParse() {
        let query = window.location.search;
        let obj = {};
        query
            .substring(1)
            .split("&")
            .map((v) => {
                let s = v.split("=");
                obj[s[0]] = decodeURIComponent(s[1]);
            });

        return obj;
    }

    contextUpdate(context, delta) {
        if (delta.includes("theme")) {
            this.setState(() => {
                return { theme: context.theme };
            });
        }

        theme = createTheme({
            palette: {
                mode: context.theme == "dark" ? "dark" : "light",
            },
        });
    }

    async getUser(token) {
        let query = `query Users {
            currentUser {
                id,
                player {
                    prefix,
                    gamerTag,
                },
                bio,
                location {
                    city,
                    country
                },
                slug,
                images {
                    url,
                    width,
                    height,
                    ratio,
                    type
                }
            }
        }`;

        try {
            const response = await fetch("https://api.start.gg/gql/alpha", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            return response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getEvents(token, gamerTag) {
        let query = `query Users($gamerTag: String!, $page: Int!, $perPage: Int!) {
            currentUser {
                events(query: {
                        perPage: $perPage,
                        page: $page
                    }) {
                    nodes {
                        id,
                        name,
                        numEntrants,
                        standings(query: {
                            filter: {
                                search: {
                                    searchString: $gamerTag
                                }
                            }
                        }) {
                            nodes {
                                placement,
                            }
                        }
                        tournament {
                            name,
                            url,
                            numAttendees,
                            images {
                                url,
                                width,
                                height,
                                ratio,
                                type
                            }
                        }
                        videogame {
                            displayName
                        }
                    },
                }
            }
        }`;
        let variables = {
            gamerTag: gamerTag,
            page: 1,
            perPage: 12,
        };

        try {
            const response = await fetch("https://api.start.gg/gql/alpha", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query, variables }),
            });

            return response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.onAuthorized(async (auth) => {
                this.Authentication.setToken(auth.token, auth.userId);
                await this.getConfig(auth.token, auth.userId);
            });

            this.twitch.onContext((context, delta) => {
                this.contextUpdate(context, delta);
            });
        }
    }

    componentWillUnmount() {
        if (this.twitch) {
            this.twitch.unlisten("broadcast", () =>
                console.log("successfully unlistened")
            );
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

    async getConfig(token, userId) {
        const config = await this.fetchConfig(token, userId);
        if (config != null) {
            if (config.msg == null) {
                const startggToken = this.parseJwt(config.token).startggToken;
                this.setConfig(startggToken);
            }
        }
    }

    parseJwt(token) {
        var base64Url = token.split(".")[1];
        var base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    }

    async setConfig(startggToken) {
        const user = await this.getUser(startggToken);
        if (user.data != null) {
            const events = await this.getEvents(
                startggToken,
                user.data.currentUser.player.gamerTag
            );
            if (events.data != null) {
                this.setState(() => {
                    return {
                        userData: user.data,
                        eventsData: events.data,
                    };
                });

                if (!this.state.finishedLoading) {
                    this.setState(() => {
                        return { finishedLoading: true };
                    });
                }
            }
        } else {
            this.setState(() => {
                return {
                    configError: true,
                };
            });
        }
    }

    render() {
        if (
            this.state.finishedLoading &&
            this.state.userData != null &&
            this.state.eventsData != null
        ) {
            return (
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <div
                        className={
                            this.state.theme === "light"
                                ? "App App-light"
                                : "App App-dark"
                        }
                    >
                        <ProfileContainer
                            authentication={this.Authentication}
                            theme={this.state.theme}
                            userData={this.state.userData}
                            eventsData={this.state.eventsData}
                        />
                    </div>
                </ThemeProvider>
            );
        } else if (this.state.configError) {
            return (
                <div
                    className={
                        this.state.theme === "light"
                            ? "App App-light"
                            : "App App-dark"
                    }
                >
                    <Typography>
                        Oops something went wrong ! Please verify the extension
                        configuration.
                    </Typography>
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
