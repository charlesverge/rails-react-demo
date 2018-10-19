import PropTypes from 'prop-types';
import React from 'react';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import {
    BrowserRouter as Router, Route
} from 'react-router-dom';

// Redux.
import { Provider } from 'react-redux';
import contentApp from './reduxhelpers/reducers';
import { setDefaults } from './reduxhelpers/actions';

// Components.
import ClassifyText from './ClassifyText';

class ClassifyApp extends React.Component {
  constructor(props) {
    super(props);
    this.store = createStore(contentApp, applyMiddleware(thunk));
    this.store.dispatch(setDefaults(this.props.model, this.props.text));
  }

  static propTypes = {
    model: PropTypes.string.isRequired, // this is passed from the Rails view
    text: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Provider store={this.store}>
        <Router>
          <Route exact path="/" component={ClassifyText} />
        </Router>
      </Provider>
    );
  }
}

export default ClassifyApp;