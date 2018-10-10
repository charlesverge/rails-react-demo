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
      loading: false,
    };
  }

  updateText = (text) => {
    this.setState({ text: text });
  };

  classify() {
     // Call api.
     // Update view.
     axios.get('/classify')
       .then(result => {
         this.setState({
           loading: false,
           result: result.data.labels,
         });
       })
       .catch(error => this.setState({
         result: "Error loading",
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
        <div><ClassifyResult result={this.state.result} /></div>
      </div>
    );
  }
}
