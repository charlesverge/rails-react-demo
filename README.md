# Text classifier rails/reactjs/tensorflow demo

The Text classifier is a demo application for Ruby On Rails with React, Tensorflow, PostgreSQL and Resdis. The application allows free-form real time exploring of text classification for a better understanding of how well a model is performing. This is a step to understanding testing based upon a predefined set of data with expected results for systematic experimentation of models and configuration.

## Screenshot
![React Rails Text classifer screenshot](https://github.com/charlesverge/rails-react-demo/raw/master/docs/screen-shot.png "Screen shot")

## Components used

1. Ruby on Rails 5 - https://rubyonrails.org/
2. React 16 - https://reactjs.org/
3. Redux - https://redux.js.org/
4. PostgreSQL - https://www.postgresql.org/
5. Redis - https://redis.io/
6. Tensorflow server - https://www.tensorflow.org/serving/
7. A tensorflow savedmodel.pb, expored vocabulary and labels - https://github.com/charlesverge/tensorflow_examples
8. Heurko - https://heroku.com/

## Setup

1. Generate a model saved model file. An example of how to save a Tensorflow estimator can be found at https://github.com/charlesverge/tensorflow_examples
2. Setup of tensorflow server and configure models, an example configuration is in modelserver/serving.conf or referrer to  https://medium.com/@brianalois/how-to-setup-tensorflow-serving-for-production-3cc2abf7efa
3. Start tensorflow server with the rest api enabled. tensorflow_model_server --model_config_file=serving.conf --port=8500 --rest_api_port=8501
4. Update TENSOR_SERVER_URL in config/initializers/api.rb
5. Setup as local Ruby on rails applaction or use Heurko - https://devcenter.heroku.com/articles/getting-started-with-rails5
6. Populate your PostgreSQL database with words and labels generated for your model
* COPY labels(model, label, label_id, created_at, updated_at) FROM 'labels-sector.csv' WITH CSV DELIMITER ',' QUOTE '"' ESCAPE '\';
* COPY words(word,model,word_id,created_at,updated_at) FROM 'words-sector.csv' WITH CSV DELIMITER ',' QUOTE '"' ESCAPE '\'
7. To start locally ```foreman start -f Procfile.dev```
