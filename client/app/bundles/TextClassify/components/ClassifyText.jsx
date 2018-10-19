import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateText } from './reduxhelpers/actions';

import ClassifyResult from './ClassifyResult';

class TextClassify extends React.Component {
  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      model: this.props.classifyStatus.model,
      text: this.props.classifyStatus.text,
      result: null,
      error: false,
      loading: false,
    };
    // Set csrf token to allow for post requests in rails 5.
    const csrfToken = document.querySelector('[name="csrf-token"]').content;
    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
  }

  updateText = (text) => {
    // Classify text one second after finishing typing text.
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.updateTimeout = setTimeout(() => {
      this.updateTimeout = false;
      this.classify();
    }, 1000);
    this.props.dispatch(updateText(text));
    this.setState({ text: text });
  };

  classify() {
    // Call api.
    // Update view.
    this.setState({
      loading: true,
    });
    if (!this.state.text) {
      this.setState({
        loading: false,
        result: null,
        error: "Please enter text to classify",
      });
      return;
    }
    axios.post('/classify', {
        text: this.state.text,
        model: this.state.model,
      })
      .then(result => {
        if (result.data.status === 'error') {
          this.setState({
            loading: false,
            result: null,
            error: "Error loading results",
          });
        } else {
          this.setState({
            loading: false,
            result: result.data.labels,
            error: false,
          });
        }
      })
      .catch(error => this.setState({
        result: null,
        error: "Error loading results",
        loading: false,
      }));
  }

  componentDidMount() {
    if (this.state.text) {
      this.classify();
    }
  }

  render() {
    return (
      <div className="ClassifyText container pt-3">
        <h1 className="text-center">Classify text</h1>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <p>Enter your text to be classified in the box bellow</p>
            <hr />
            <form>
              <div className="form-group">
                <textarea
                className="form-control"
                id="text"
                rows="10"
                type="text"
                value={this.state.text}
                onChange={(e) => this.updateText(e.target.value)}
              />
              </div>
            </form>
            <hr />
            <b>{this.state.error}</b>
            <div><ClassifyResult
              result={this.state.result}
              loading={this.state.loading}
              error={this.state.error}
            /></div>
          </div>
          <div className="col-md-2"></div>
      </div>
    </div>);
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    classifyStatus: state.classifyStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: dispatch,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TextClassify));
