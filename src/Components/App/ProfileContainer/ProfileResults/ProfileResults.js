import React from "react";
import EventResult from "./EventResult/EventResult";

import "./ProfileResults.css";

export default class ProfileResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            theme: this.props.theme,
            eventsData: this.props.eventsData,
        };
    }

    render() {
        return (
            <div className="wrapper">
                <div className="results">
                    <div className="results-container">
                        {/* <span className="results-title">Results</span> */}
                        <div className="results-grid">
                            {this.props.eventsData
                                ? this.props.eventsData.currentUser.events.nodes
                                    ? this.props.eventsData.currentUser.events.nodes.map(
                                          (value, index) => {
                                              return (
                                                  <EventResult
                                                      authentication={
                                                          this.Authentication
                                                      }
                                                      theme={this.state.theme}
                                                      key={index}
                                                      node={value}
                                                  />
                                              );
                                          }
                                      )
                                    : ""
                                : ""}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
