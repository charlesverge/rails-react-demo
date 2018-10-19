import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import ClassifyResult from './ClassifyResult';

export default class TextClassify extends React.Component {
  static propTypes = {
    model: PropTypes.string.isRequired, // this is passed from the Rails view
    text: PropTypes.string.isRequired,
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      model: this.props.model,
      text: this.props.text,
      result: null,
      error: false,
      loading: false,
    };
    // Set csrf token to allow for post requests in rails 5.
    const csrfToken = document.querySelector('[name="csrf-token"]').content;
    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
  }

  updateText = (text) => {
    this.setState({ text: text });
  };

  classify() {
    // Call api.
    // Update view.
    axios.post('/classify', {
        text: this.state.text,
        model: this.state.model,
      })
      .then(result => {
        this.setState({
          loading: false,
          result: result.data.labels,
          error: false,
        });
      })
      .catch(error => this.setState({
        result: null,
        error: "Error loading",
        loading: false,
      }));
  }

  render() {
    return (
      <div className="ClassifyText">
        <h3>
          You selected model is: {this.state.model}
        </h3>
        <hr />
        <form >
          <textarea
            id="text"
            type="text"
            value={this.state.text}
            onChange={(e) => this.updateText(e.target.value)}
          />
        </form>
        <button onClick={() => this.classify()}>Classify</button>
        <hr />
        <b>{this.state.error}</b>
        <div><ClassifyResult result={this.state.result} /></div>
      </div>
    );
  }
}
