module Response
  def json_response(object, status = :ok)
    render json: object, status: status, content_type: 'application/json'
  end
end
