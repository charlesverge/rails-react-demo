import PropTypes from 'prop-types';
import React from 'react';

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
    };
  }

  updateText = (text) => {
    this.setState({ text: text });
  };

  classify() {
     // Call api.
     // Update view.
     this.setState({ result: "Result text"});
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
        <div>{this.state.result}</div>
      </div>
    );
  }
}
