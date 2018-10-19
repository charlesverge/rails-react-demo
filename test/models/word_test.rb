require 'test_helper'

class WordTest < ActiveSupport::TestCase
  test "testing after_create for word model" do
     word = Word.create(word: "testword", word_id: 99, model: "test")
     wordinredis = $redis.hget("word_ids_test", "testword")

     # Test that the word id is stored in redis properly
     assert_equal "99", wordinredis

     # Test that the Wosthash retrieves word id as expected
     assert_equal "99", Wordhash[{model: "test", word: "testword"}]
  end
end
