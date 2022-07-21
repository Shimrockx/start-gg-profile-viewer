import React from "react";
import Authentication from "../Authentication/Authentication";

import ProfileContainer from "./ProfileContainer/ProfileContainer";
import "./App.css";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.Authentication = new Authentication();

        this.anchor = this.queryParamParse().anchor;
        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
        this.twitch = window.Twitch ? window.Twitch.ext : null;
        this.state = {
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
    }

    async getUser(slug, gamerTag) {
        let query = `query Users($slug: String!, $gamerTag: String!, $page: Int!, $perPage: Int!) {
            user(slug: $slug) {
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
                },
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
            slug: slug,
            gamerTag: gamerTag,
            page: 1,
            perPage: 12,
        };

        try {
            const response = await fetch("https://api.start.gg/gql/alpha", {
                method: "POST",
                headers: {
                    Authorization: "Bearer a5852d4b5ed80266a01b3226cc613549",
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

    async setConfig(config) {
        const data = await this.getUser(config.slug, config.gamerTag);
        if (data != null) {
            this.setState(() => {
                return {
                    query: data,
                };
            });

            if (!this.state.finishedLoading) {
                this.setState(() => {
                    return { finishedLoading: true };
                });
            }
        }
    }

    componentDidMount() {
        if (this.twitch) {
            this.twitch.onAuthorized((auth) => {
                this.Authentication.setToken(auth.token, auth.userId);
            });

            this.twitch.onContext((context, delta) => {
                this.contextUpdate(context, delta);
            });

            this.twitch.configuration.onChanged(() => {
                let config = this.twitch.configuration.broadcaster
                    ? this.twitch.configuration.broadcaster.content
                    : "";
                try {
                    config = JSON.parse(config);
                    this.setConfig(config);
                } catch (error) {
                    config = "";
                }
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

    render() {
        if (this.state.finishedLoading && this.state.query != null) {
            if (this.state.query.data != null) {
                if (this.state.query.data.user != null) {
                    return (
                        <div
                            className={
                                this.state.theme === "light"
                                    ? "App App-light"
                                    : "App App-dark"
                            }
                        >
                            <ProfileContainer
                                query={this.state.query}
                                authentication={this.Authentication}
                                theme={this.state.theme}
                            />
                        </div>
                    );
                }
            }
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
