class HttpRequest {
  constructor() {
    this.baseUrl = "https://spotify.f8team.dev/api/";
  }
  async _send(path, method, data, options = {}) {
    try {
      const _option = {
        ...options,
        method,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
      };
      if (data) {
        _option.body = JSON.stringify(data);
      }
      const res = await fetch(`${this.baseUrl}${path}`, _option);
      if (!res.ok) {
        if (res.status === 429) {
          alert("Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại.");
        }
        throw new Error("HTTP error", res.status);
      }
      const response = await res.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async get(path, options) {
    return await this._send(path, "GET", null, options);
  }
  async post(path, data, options) {
    return await this._send(path, "POST", data, options);
  }
  async put(path, data, options) {
    return await this._send(path, "PUT", data, options);
  }
  async path(path, data, options) {
    return await this._send(path, "PATH", data, options);
  }
  async del(path, options) {
    return await this._send(path, "DELETE", null, options);
  }
}
const httpRequest = new HttpRequest();
export default httpRequest;
