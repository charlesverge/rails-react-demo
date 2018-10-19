class Wordhash
  class << self

    # This defines the getter so that word id's can be retrieved with Wordhash[word]
    def [](word)
      redis.hget(hash, word)
    end

    # This defines the setter so you can run Wordhash[word] = id
    def []=(word, id)
      # word => id
      redis.hset(hash, word, id)
    end

    # Delete word from redis
    def destroy(word)
      redis.hdel(hash, word)
    end

    private

      def redis
        $redis
      end

      def hash
        "word_ids"
      end
  end
end