class Word < ApplicationRecord
  after_save :add_to_wordhash

  private

  # After a word is saved add the id to the redis index cache.
  def add_to_wordhash
    Wordhash[{model: self.model, word: self.word}] = self.word_id.to_s
    return true
  end
end
