import React from "react";
import Authentication from "../../util/Authentication/Authentication";

import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();

    //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      finishedLoading: false,
      slideOpen: true,
      requestsOpen: true
    };

    this.parseConfigUpdate = this.parseConfigUpdate.bind(this);
  }

  componentDidMount() {
    if (this.twitch) {
      this.twitch.configuration.onChanged(() => {
        const broadcasterConfig = this.twitch.configuration.broadcaster.content;
        this.parseConfigUpdate(broadcasterConfig);
      });

      this.twitch.listen("broadcast", (_target, _contentType, message) => {
        this.parseConfigUpdate(message);
      });

      this.twitch.onAuthorized(auth => {
        console.log(auth);

        this.Authentication.setToken(auth.token, auth.userId);

        console.log(auth.token);
        fetch("https://burlywood-bat-1779.twil.io/twitch", {
          method: "POST",
          body: JSON.stringify({
            token: auth.token,
            number: "+13155729525",
            question:
              "My question is something like this and lorem ipsum dolor text."
          })
        })
          .then(response => response.json())
          .then(json => console.log(json));

        this.twitch.rig.log(auth);
        if (!this.state.finishedLoading) {
          this.setState(() => {
            return { finishedLoading: true };
          });
        }
      });
    }
  }

  parseConfigUpdate(message) {
    const { slideOpen } = this.state;

    if (!message) return;
    const config = JSON.parse(message);

    let slideOpenStatus = slideOpen;
    if (!config.requestsOpen) {
      slideOpenStatus = false;
    }

    this.setState({
      requestsOpen: config.requestsOpen || false,
      slideOpen: slideOpenStatus
    });
  }

  render() {
    const askedQuestion = false;
    const { requestsOpen, slideOpen } = this.state;

    if (this.state.finishedLoading) {
      return (
        <div className="App">
          <h1>Talk to Me</h1>
          {requestsOpen ? (
            <React.Fragment>
              <p>
                Enter your information and a question below and get a chance to
                talk with me.
              </p>
              <a
                className="button"
                onClick={() => this.setState({ slideOpen: true })}
              >
                {askedQuestion ? "Edit Question" : "Ask a Question"}
              </a>
            </React.Fragment>
          ) : (
            <p>The broadcaster is not currently accepting questions!</p>
          )}

          <div className={`content${slideOpen ? " slide_up" : ""}`}>
            <div className="inner">
              <div className="header">
                <span>
                  {askedQuestion ? "Edit Question" : "Ask a Question"}
                </span>
                <div className="close">
                  <a onClick={() => this.setState({ slideOpen: false })}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ffffff"
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                      />
                      <path d="M0 0h24v24H0z" fill="none" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="ask-input">
                <label>Phone Number</label>
                <input placeholder="+12345678900" />
                <label>Question</label>
                <input placeholder="I want to know more about..." />
                <a className="call_button">Submit</a>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="App" />;
    }
  }
}
