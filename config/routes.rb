Rails.application.routes.draw do
  get 'hello_world', to: 'hello_world#index'

  get 'classify_text/index'

  root 'classify_text#index'

  get 'classify', to: 'classify_text#classify'
end
