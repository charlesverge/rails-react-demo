class ClassifyTextController < ApplicationController
  def index
  end
  def classify
    result = ["business 1", "business 2"]
    json_response(result)
  end
end
