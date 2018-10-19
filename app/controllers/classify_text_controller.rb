class ClassifyTextController < ApplicationController
  def index
    @props = {
      'model' => 'sector',
      'text'  => '"Google is not a conventional company We do not intend'\
      ' to become one " That unconventional spirit has been a driving force'\
      ' throughout our history -- inspiring us to do things like rethink the'\
      ' mobile device ecosystem with Android and map the world with Google Maps'\
      ' As part of that, our founders also explained that you could expect us'\
      ' to make "smaller bets in areas that might seem very speculative or even'\
      ' strange when compared to our current businesses'
    }
  end

  def classify
    params.require(:text)
    params.require(:model)
    begin
      # Make prediction
      api = Predict::Api.new(params["model"])
      result = api.predict(params["text"])

      # Save prediction
      classifiedentry = Classified.create(body: params["text"],
        model: params["model"])
      bytop = result["outputs"]["prob"][0].each_with_index.map{ |j,i| [i,j] }.sort { |x,y| y[1] <=> x[1] }
      label = Label.where(model: params["model"],
        label_id: result["outputs"]["class"][0]).first
      if label
        classifiedentry.labels << label
      else
        raise
      end
      labels = []
      print(bytop)
      for x in bytop[0..2]
        label = Label.where(model: params["model"], label_id: x[0]).first
        if label
          labels << {
            label: label.label,
            prob: '%.2f' % (x[1]*100),
          }
        end
      end
      json_response({
        'labels': labels,
      })
    rescue
      json_response({
        'labels': [],
        'status': 'error',
      })
    end
  end
end
