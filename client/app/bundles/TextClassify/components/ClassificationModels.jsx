import React from 'react';
import { updateModel } from './reduxhelpers/actions';

class Model extends React.Component {
  updateModel() {
     // This will trigger updating of the classification model.
     this.props.dispatch(updateModel(this.props.model.name));
     $('.modal').modal('hide');
  }

  render() {
    let classes = "btn btn-sm btn-primary w-100";
    if (this.props.active) {
        classes += " active";
    }
    return <div className="row py-1">
        <div className="col-3">
          <button className={classes} onClick={() => this.updateModel()}>{this.props.model.name}</button>
        </div>
        <div className="col-9 text-left">{this.props.model.description}
        </div>
      </div>;
   }
}

export default class ClassificationModels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      models: props.models,
      model: props.model,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      models: nextProps.models,
      model: nextProps.model,
      loading: nextProps.loading,
    };
  }

  /**
   * Render panel for model, including modal for selecting defined models.
   */
  render() {
    let items = [];
    for (let i = 0; i < this.state.models.length; i++) {
        items.push(<Model active={this.state.models[i].name === this.state.model}
           key={this.state.models[i].name}
           model={this.state.models[i]}
           dispatch={this.props.dispatch}
        />);
    }
    return <div id="model" className="card orange0">
      <div className="card-body">
        <h5 className="card-title">Model <i className="fa fa-cog settings model" data-toggle="modal" data-target="#modelSettings"></i></h5>
        <p className="card-text">{this.state.model}</p>
      </div>
      <div className="modal fade" id="modelSettings" tabIndex="-1" role="dialog" aria-labelledby="modelSettingsLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modelSettingsLabel">Model settings</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {items}
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
