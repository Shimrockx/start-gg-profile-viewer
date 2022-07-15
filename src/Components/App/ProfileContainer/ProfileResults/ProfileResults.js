import React from "react";
import EventResult from "./EventResult/EventResult";

import "./ProfileResults.css";

export default class ProfileResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            theme: this.props.theme,
            events: this.props.events,
        };
    }

    render() {
        return (
            <div className="wrapper">
                <div className="results">
                    <div className="results-container">
                        {/* <span className="results-title">Results</span> */}
                        <div className="results-grid">
                            {this.props.events
                                ? this.props.events.nodes
                                    ? this.props.events.nodes.map(
                                          (value, index) => {
                                              return (
                                                  <EventResult
                                                      key={index}
                                                      node={value}
                                                      authentication={
                                                          this.Authentication
                                                      }
                                                      theme={this.state.theme}
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
