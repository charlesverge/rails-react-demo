class ClassifyTextController < ApplicationController
  def index
    @props = {
      'model' => 'business',
      'text'  => 'Google is a multinational corporation that is specialized in internet-related services and products.',
    }
  end
  def classify
    result = {
      labels: ["business type 1", "business type 2"],
    }
    json_response(result)
  end
end
