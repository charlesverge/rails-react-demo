import React from 'react';

export default class ClassifyResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: props.result,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.result) {
      return { result: nextProps.result };
    }
    return {
      result: null,
    };
  }

  render() {
    if (this.state.result) {
      let items = this.state.result.map(item => <li key={item}>{item}</li>);
      return <div><h3>Results</h3><ul>{items}</ul></div>;
    }
    return null;
  }
}
