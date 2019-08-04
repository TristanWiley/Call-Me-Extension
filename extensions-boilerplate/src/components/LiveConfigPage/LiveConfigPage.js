import React from "react";
import Authentication from "../../util/Authentication/Authentication";

import "./LiveConfigPage.css";
import CallOverview from "./call_overview";

export default class LiveConfigPage extends React.Component {
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();

    //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      token: null,
      finishedLoading: false,
      requestsOpen: false,
      slideOpen: false
    };

    this.toggleRequests = this.toggleRequests.bind(this);
  }

  componentDidMount() {
    if (this.twitch) {
      this.twitch.configuration.onChanged(() => {
        const broadcasterConfig = this.twitch.configuration.broadcaster.content;
        if (!broadcasterConfig) return;
        const config = JSON.parse(broadcasterConfig);

        this.setState({ requestsOpen: config.requestsOpen || false });
      });
      this.twitch.onAuthorized(auth => {
        this.Authentication.setToken(auth.token, auth.userId);

        this.setState({ token: auth.token, finishedLoading: true });
      });
    }
  }

  toggleRequests() {
    const { requestsOpen } = this.state;
    let newState = !requestsOpen;

    this.twitch.configuration.set(
      "broadcaster",
      "1.0",
      JSON.stringify({ requestsOpen: newState })
    );
    this.twitch.send(
      "broadcast",
      "application/json",
      JSON.stringify({ requestsOpen: newState })
    );
    this.setState({
      requestsOpen: newState
    });
  }

  render() {
    const { token, phoneNumber, requestsOpen, slideOpen } = this.state;

    if (this.state.finishedLoading) {
      return (
        <div className="LiveConfigPage">
          <div className="top">
            <input
              className="text_input"
              placeholder="Your phone number"
              onChange={e => {
                this.setState({ phoneNumber: e.currentTarget.value });
              }}
              value={phoneNumber}
            />
          </div>
          <h1 className="no_select">
            {requestsOpen ? "Disable" : "Enable"} Calls
          </h1>
          <label
            className={`requestsButton ${
              requestsOpen ? "activated" : "deactivated"
              }`}
            htmlFor="requestsOpen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                fill="#ffffff"
                d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"
              />
            </svg>
          </label>
          <input
            id="requestsOpen"
            className="requestsBox"
            type="checkbox"
            value={requestsOpen}
            onClick={() => this.toggleRequests()}
          />
          {requestsOpen && (
            <a
              className="call_requests no_select"
              onClick={() =>
                this.setState({
                  slideOpen: true
                })
              }
            >
              Call Requests (6)
            </a>
          )}
          <div className={`content${slideOpen ? " slide_up" : ""}`}>
            <div className="inner">
              {token && <CallOverview
                token={token}
                closeModal={() =>
                  this.setState({
                    slideOpen: false
                  })
                }
              />}
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="LiveConfigPage" />;
    }
  }
}
