import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateText } from './reduxhelpers/actions';

import ClassificationModels from './ClassificationModels';
import ClassifyResult from './ClassifyResult';

class TextClassify extends React.Component {
  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      text: this.props.classifyStatus.text,
      filter: "None",
      tokenizer: "Regex",
      model: this.props.classifyStatus.model,
      models: [
        {
          name: "sector",
          description: "Classify business descriptions into sectors"
        },
        {
          name: "industry",
          description: "Classify business descriptions into industry"
        },
      ],
      filters: [
        {
          name: "None",
          description: "No filter",
        },
        {
          name: "Common stopwords",
          description: "Ignore stop words like words a, is, the, are, etc..."
        },
        {
          name: "Strip HTML",
          description: "Strip html"},
        {
          name: "Strip Quotes",
          description: "Replace quotes with spaces"
        },
      ],
      tokenizers: [
        {
          name: "Regex",
          description: "Use regex pattern /[A-Z]{2,}(?![a-z])|[A-Z][a-z]+(?=[A-Z])|[\'\w\-]+/ to split words"
        },
        {
          name: "Simple split",
          description: "Only split words seperated by a space"
        },
      ],
      result: null,
      error: false,
      loading: false,
    };
    // Set csrf token to allow for post requests in rails 5.
    const csrfToken = document.querySelector('[name="csrf-token"]').content;
    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
  }

  /**
   * When redux passes new props, update the state.
   * @param nextProps Next props.
   * @param prevState Previous state.
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.model == nextProps.classifyStatus.model) {
      return null;
    } else {
      return {
        model: nextProps.classifyStatus.model,
      };
    }
  }

  /**
   * Component did update, check to see if state has changed, if so classify text.
   * @param prevProps Previous props.
   * @param prevState Previous state before update.
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevState.model !== this.state.model) {
      this.classify();
    }
  }

  /**
   * Update text and classify after one second pause.
   * @param text Text from textarea.
   */
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

  /**
   * Classify text with settings in state.
   */
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

  /**
   * Classify text when component mounts for the first time and draw pipes.
   */
  componentDidMount() {
    if (this.state.text) {
      this.classify();
    }
    // Timeout of source allows for drawing after browser has rendered.
    setTimeout(() => {
      $(".svgContainer").HTMLSVGconnect({
        stroke: "#19b5fe",
        paths: [
          {start: "#text", end: "#filter"},
          {start: '#filter', end: '#tokenizer'},
          {start: '#tokenizer', end: '#model'},
          {start: '#model', end: '#output'}
        ]});
    }, 0);
  }

  /**
   * Render form and components for visualization.
   */
  render() {
    return (
      <div className="ClassifyText container pt-3">
        <h1 className="text-center">Classify text</h1>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8">
          <div className="pb-5">
            <p>Enter your text to be classified in the box bellow</p>
            <hr />
            <form>
              <div className="form-group">
                <textarea
                className="form-control w-100"
                id="text"
                rows="10"
                type="text"
                value={this.state.text}
                onChange={(e) => this.updateText(e.target.value)}
              />
              </div>
            </form>
            </div>
            <div className="row text-center">
              <div className="col-sm-4 p-4">
                <div id="filter" className="card purple0">
                  <div className="card-body">
                    <h5 className="card-title">Filter</h5>
                    <p className="card-text">{this.state.filter}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 p-4">
                <div id="tokenizer" className="card green0">
                  <div className="card-body">
                    <h5 className="card-title">Tokenizer</h5>
                    <p className="card-text">{this.state.tokenizer}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 p-4">
                <ClassificationModels
                  models={this.state.models}
                  model={this.state.model}
                  dispatch={this.props.dispatch} />
              </div>
            </div>
            <div className="row pt-5">
              <div className="col-12">
                <div id="output" className="card green1">
                  <div className="card-body">
                    <h3 className="card-title">Results</h3>
                    <p className="card-text">
                      <b>{this.state.error}</b>
                    </p>
                    <ClassifyResult
                      result={this.state.result}
                      loading={this.state.loading}
                      error={this.state.error}
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </div>
          <div className="col-md-2"></div>
      </div>
    </div>);
  }
}


/**
 * Set classifyStatus in props for ClassifyText component.
 * @param state redux state tree.
 */
const mapStateToProps = (state, ownProps) => {
  return {
    classifyStatus: state.classifyStatus,
  }
}

/**
 * Pass the dispatch function to ClassifyText component as a prop.
 * @param dispatch Dispatch function for sending redux updates.
 */
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: dispatch,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TextClassify));
