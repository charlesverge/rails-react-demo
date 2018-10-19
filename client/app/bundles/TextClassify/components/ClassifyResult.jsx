import React from 'react';

export default class ClassifyResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: props.result,
      loading: props.loading,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      result: nextProps.result,
      loading: nextProps.loading,
    };
  }

  render() {
    if (this.state.loading) {
      return <div><h3>Results</h3>
        <div className="text-center p-3">
          <b>Loading</b>
          <div className="loader mx-auto"></div>
        </div>
      </div>;
    }
    if (this.state.error) {
      return <div><h3>Error loading</h3></div>;
    }
    if (this.state.result) {
      let items = this.state.result
          .map(item => <li key={item.label}>{item.prob}% {item.label}</li>);
      return <div><h3>Results</h3><ul>{items}</ul></div>;
    }
    return null;
  }
}
