interface ResponseType {
  message: string;
  payload?: any;
  error?: any;
  token?: string;
}

function sendResponse({ message, payload, error, token }: ResponseType) {
  return {
    message,
    payload,
    error,
    token,
  };
}

export default sendResponse;
