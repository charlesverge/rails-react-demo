# Simple prediction class to make requests from tensorflow server
# For a more complex project the tokenizer, api call and prediction api
# could be moved to their own classes to allow for easier extensibility
# and handling of errors.
module Predict
  class Api
    def initialize(model)
      # The size of the sentence predict api is expecting.
      @sentence_size = 349
      # Body of response
      @body = ''
      # Model requesting predictions from
      @model = model.gsub(/[^0-9a-z]/i, '').downcase
      # Url for model
      @url = TENSOR_SERVER_URL
    end

    def predict(sentence)
      # Build request and retrieve prediction from rest api
      data = build_request(sentence)
      return request_prediction(data)
    end

    def build_request(sentence)
      # Built request
      raise ArgumentError, 'Argument is not a string' unless sentence.is_a? String || sentence.empty?
      tokensids = tokenize(sentence)
      data = {
          :inputs => {
              :words => [tokensids],
          }
      }
      return data
    end

    def request_prediction(data)
      # Make rest api call to tensorflow server for prediction
      c = Curl::Easy.http_post("#{@url}#{@model}:predict", JSON.pretty_generate(data)) do |curl|
          curl.headers['Accept'] = 'application/json'
          curl.headers['Content-Type'] = 'application/json'
        end
      @body = c.body_str
      if not c.body_str
        return nil
      end
      return JSON.parse(c.body_str)
    end

    def getbody()
      # Get body of request
      return @body
    end

    def tokenize(sentence)
      # Turn sentences in to an array of integers
      tokens = sentence.scan(/[A-Z]{2,}(?![a-z])|[A-Z][a-z]+(?=[A-Z])|[\'\w\-]+/)
      # Convert to int
      tokenids = []
      for word in tokens
        if word.length > 2
          tokenids << self.get_word_id(word).to_i()
        end
      end
      if tokenids.size < @sentence_size
        tokenids.fill(0, tokenids.size, @sentence_size)
      end
      return tokenids[0..@sentence_size]
    end

    def get_word_id(word)
      # Get the word id from redis and if not found try the postgresql db
      # Other wise return 0
      # This is a use case for using redis for caching associations.
      #
      # Note: Instead of redis as the caching method, the word => id table can
      # be stored inside a tensorflow model by using
      # tf.contrib.lookup.index_to_string_table_from_file, this would reduce
      # complexity on client and increase on the tensorflow model.
      if id = Wordhash[{ model: @model, word: word}]
        return id
      else
        return 0
      end
    end
  end
end
