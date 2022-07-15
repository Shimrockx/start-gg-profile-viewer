import React from "react";
import logo from "./assets/start-gg-logo.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HelpIcon from "@mui/icons-material/Help";

import ProfileResults from "./ProfileResults/ProfileResults";
import "./ProfileContainer.css";

export default class ProfileContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            theme: this.props.theme,
            query: this.props.query,
        };
    }

    getUserAvatar() {
        let imgUrl = "";
        if (this.state.query.data.user.images != null) {
            for (let i = 0; i < this.state.query.data.user.images.length; i++) {
                let image = this.state.query.data.user.images[i];
                if (image != null) {
                    if (image.type == "profile") {
                        imgUrl = image.url;
                    }
                }
            }
        }
        return imgUrl;
    }

    getPlayerName() {
        if (
            this.state.query.data.user.player.prefix != null &&
            this.state.query.data.user.player.gamerTag != null
        ) {
            return (
                <>
                    <span
                        className={
                            this.state.theme === "light"
                                ? "profile-name-prefix-light"
                                : "profile-name-prefix-dark"
                        }
                    >
                        {this.state.query.data.user.player.prefix}
                    </span>
                    <span
                        className={
                            this.state.theme === "light"
                                ? "profile-name-gamertag-light"
                                : "profile-name-gamertag-dark"
                        }
                    >
                        {this.state.query.data.user.player.gamerTag}
                    </span>
                </>
            );
        } else if (
            this.state.query.data.user.player.prefix != null &&
            this.state.query.data.user.player.gamerTag == null
        ) {
            return (
                <>
                    <span
                        className={
                            this.state.theme === "light"
                                ? "profile-name-prefix-light"
                                : "profile-name-prefix-dark"
                        }
                    >
                        {this.state.query.data.user.player.prefix}
                    </span>
                </>
            );
        } else if (
            this.state.query.data.user.player.prefix == null &&
            this.state.query.data.user.player.gamerTag != null
        ) {
            return (
                <>
                    <span
                        className={
                            this.state.theme === "light"
                                ? "profile-name-gamertag-light"
                                : "profile-name-gamertag-dark"
                        }
                    >
                        {this.state.query.data.user.player.gamerTag}
                    </span>
                </>
            );
        } else {
            return <></>;
        }
    }

    getLocation() {
        if (
            this.state.query.data.user.location.city != null &&
            this.state.query.data.user.location.country != null
        ) {
            return (
                <>
                    <LocationOnIcon fontSize="small" />
                    <span className="profile-location">
                        {this.state.query.data.user.location.city},{" "}
                        {this.state.query.data.user.location.country}
                    </span>
                </>
            );
        } else if (
            this.state.query.data.user.location.city != null &&
            this.state.query.data.user.location.country == null
        ) {
            <>
                <LocationOnIcon fontSize="small" />
                <span className="profile-location">
                    {this.state.query.data.user.location.city}
                </span>
            </>;
        } else if (
            this.state.query.data.user.location.city == null &&
            this.state.query.data.user.location.country != null
        ) {
            <>
                <LocationOnIcon fontSize="small" />
                <span className="profile-location">
                    {this.state.query.data.user.location.country}
                </span>
            </>;
        } else {
            <></>;
        }
    }

    render() {
        return (
            <div className="wrapper">
                <div className="navbar">
                    <div className="navbar-container">
                        <div className="navbar-top">
                            <div className="navbar-logo-container">
                                <div className="navbar-logo-link">
                                    <a
                                        href="https://www.start.gg"
                                        aria-label="Homepage"
                                        data-skiptrap="true"
                                        target="_blank"
                                    >
                                        <img
                                            src={logo}
                                            alt="Start GG - Logo"
                                            className="navbar-logo"
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className="navbar-help-container">
                                <a
                                    href="https://github.com/Shimrockx"
                                    aria-label="Homepage"
                                    data-skiptrap="true"
                                    target="_blank"
                                >
                                    <HelpIcon sx={{ color: "#c3cacf" }} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="featureCanvas">
                    <div className="header">
                        <div className="header-container">
                            <div className="profile-container">
                                <div className="profile-main-container">
                                    <div className="profile-avatar-container">
                                        <a
                                            href={
                                                "https://www.start.gg/" +
                                                this.state.query.data.user.slug
                                            }
                                            target="_blank"
                                        >
                                            <img
                                                src={this.getUserAvatar()}
                                                alt={
                                                    this.state.query.data.user
                                                        .id
                                                }
                                                className="profile-avatar"
                                            ></img>
                                        </a>
                                    </div>
                                    <div className="profile-name-container">
                                        <span>{this.getPlayerName()}</span>
                                    </div>
                                </div>
                                <div className="profile-info-container">
                                    <div
                                        className={
                                            this.state.theme === "light"
                                                ? "profile-location-container-light"
                                                : "profile-location-container-dark"
                                        }
                                    >
                                        {this.getLocation()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile-main">
                        <ProfileResults
                            events={this.props.query.data.user.events}
                            authentication={this.Authentication}
                            theme={this.state.theme}
                        ></ProfileResults>
                    </div>
                </div>
            </div>
        );
    }
}
