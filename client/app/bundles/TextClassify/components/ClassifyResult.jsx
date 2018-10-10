import React from 'react';

export default class ClassifyResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: props.result,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.result) {
      this.setState({ result: nextProps.result });
    }
  }

  render() {
    if (this.state.result) {
      let items = this.state.result.map(item => <li key={item}>{item}</li>);
      return <div><h3>Results</h3><ul>{items}</ul></div>;
    }
    return null;
  }
}
