import React from "react";

import "./EventResult.css";

export default class EventResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            theme: this.props.theme,
            node: this.props.node,
        };
    }

    getEventStandingPlacement() {
        if (this.props.node.standings.nodes.length > 0) {
            return (
                <>
                    <span className="event-placement">
                        {this.props.node.standings.nodes[0].placement}
                        th
                    </span>
                    <span className="event-attendees">
                        {" "}
                        of {this.props.node.numEntrants}
                    </span>
                </>
            );
        } else {
            return <></>;
        }
    }

    getTournamentProfileImgUrl() {
        let imgUrl = "";
        if (this.state.node.tournament.images != null) {
            for (let i = 0; i < this.state.node.tournament.images.length; i++) {
                let image = this.state.node.tournament.images[i];
                if (image != null) {
                    if (image.type == "profile") {
                        imgUrl = image.url;
                    }
                }
            }
        }
        return imgUrl;
    }

    render() {
        if (this.props.node != null) {
            if (this.props.node.standings != null) {
                return (
                    <div className="wrapper">
                        <div className="event">
                            <a
                                className="event-link"
                                href={
                                    "https://www.start.gg/" +
                                    this.props.node.tournament.url
                                }
                                target="_blank"
                            >
                                <div className="event-container">
                                    <span className="event-result">
                                        {this.getEventStandingPlacement()}
                                    </span>
                                    <div>
                                        <hr className="event-separator"></hr>
                                    </div>
                                    <div className="event-title-container">
                                        <div className="event-title-profile">
                                            <div className="event-title-profile-avatar">
                                                <img
                                                    src={this.getTournamentProfileImgUrl()}
                                                    alt={
                                                        this.props.node
                                                            .tournament.name
                                                    }
                                                    className="event-title-profile-avatar-img"
                                                />
                                            </div>
                                        </div>
                                        <div className="event-title-content">
                                            <span className="event-title-typography">
                                                {this.props.node.name + " "}
                                                <span className="event-title-typography-light">
                                                    at
                                                </span>
                                                {" " +
                                                    this.props.node.tournament
                                                        .name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                );
            }
        }
    }
}
