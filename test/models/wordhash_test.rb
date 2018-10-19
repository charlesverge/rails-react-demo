require 'test_helper'

class WordTest < ActiveSupport::TestCase
  test "wordhash caching after_create" do
     # Test that the Wosthash retrieves word id as expected
     assert_equal "1", Wordhash[{model: "sector", word: "testword1"}]
  end
end
