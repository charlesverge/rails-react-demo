# Wordhash accepts a hash to lookup a word in a model.
# Wordhash[{word: :word, model: "model"}]
class Wordhash
  class << self

    # This defines the getter so that word id's can be retrieved with
    # Wordhash[word]
    def [](word)
      if not word[:word]
        return nil
      end
      id = redis.hget(hash(word), word[:word])
      if id
        return id
      else
        wordmodel = Word.where(:word => word[:word],
          :model => word[:model]).first
        if wordmodel
          # Load word into redis.
          Wordhash[word] = wordmodel.word_id
          return wordmodel.word_id
        else
          # Zero repersents an unknown word.
          Wordhash[word] = 0
          return 0
        end
      end
    end

    # This defines the setter so you can run
    # Wordhash[{word: :word, model: "model"}] = id
    def []=(word, id)
      # word => id
      redis.hset(hash(word), word[:word], id)
    end

    # Delete word from redis
    def destroy(word)
      redis.hdel(hash(word), word[:word])
    end

    private

      def redis
        $redis
      end

      def hash(word)
        # Allow for no model to be set.
        model = word[:model]
        if not model
          return "word_ids"
        else
          return "word_ids_" + model
        end
      end
  end
end
