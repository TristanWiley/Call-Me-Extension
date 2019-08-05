import React from "react";
import PropTypes from "prop-types";

import "./CallOverview.css";

const testData = [
  {
    twitch_username: "lesirhype",
    text: "My question is something like this and lorem ipsum dolor text.",
    phone_number: "+13155729525"
  },
  {
    twitch_username: "testusername",
    text: "My question is something like this and lorem ipsum dolor text.",
    phone_number: "+13155729525"
  },
  {
    twitch_username: "someoneelse",
    text: "My question is something like this and lorem ipsum dolor text.",
    phone_number: "+13155729525"
  },
  {
    twitch_username: "BlueLava",
    text: "My question is something like this and lorem ipsum dolor text.",
    phone_number: "+13155729525"
  },
  {
    twitch_username: "mauerbac",
    text: "My question is something like this and lorem ipsum dolor text.",
    phone_number: "+13155729525"
  }
];

export default class CallOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: testData,
      searchQuery: ""
    };

    this.declineCall = this.declineCall.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
  }

  componentDidMount() {
    this.getQuestions()
  }

  getQuestions() {
    const { token } = this.props

    fetch("https://burlywood-bat-1779.twil.io/questions", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token
      })
    })
      .then(response => response.json())
      .then(json => this.setState({ questions: json.questions }))
  }

  declineCall(id) {
    const { questions } = this.state;

    questions.splice(id, 1);

    this.setState({ questions });
  }

  render() {
    const { questions, searchQuery } = this.state;
    const { closeModal } = this.props;

    return (
      <div className="call_overview">
        <div className="header">
          <span>Questions</span>
          <div className="close">
            <a onClick={() => this.getQuestions()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#fff"
                  d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </a>
            <a onClick={() => closeModal()}>
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
        <div className="search">
          <input
            className="searchInput"
            placeholder="Search for users..."
            onChange={e =>
              this.setState({
                searchQuery: e.currentTarget.value
              })
            }
          />
        </div>
        <div className="calls">
          {questions
            .filter(question =>
              question.twitch_username.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((question, id) => (
              <React.Fragment key={question.twitch_username}>
                <div className="call">
                  <strong>{question.twitch_username}</strong>
                  <p>{question.text}</p>
                </div>
                <div className="buttons">
                  <a className="accept" onClick={() => console.log("Call")}>
                    Call
                  </a>
                  <a className="decline" onClick={() => this.declineCall(id)}>
                    Delete
                  </a>
                </div>
              </React.Fragment>
            ))}
        </div>
      </div>
    );
  }
}

CallOverview.propTypes = {
  closeModal: PropTypes.func.isRequired
};
