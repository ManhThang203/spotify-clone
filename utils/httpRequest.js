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
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        _option.headers.Authorization = `Bearer ${accessToken}`;
      }

      if (data) {
        _option.body = JSON.stringify(data);
      }
      const res = await fetch(`${this.baseUrl}${path}`, _option);
      const response = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          alert("Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại.");
        }
        if (res.status === 401) {
          console.log("token không hợp lệ . Vui lòng Đăng nhập lại");
        } else if (res.status === 400) {
          console.log("kiểm tra lại kiểu dữ liệu");
        }
        const error = new Error("HTTP error", res.status);
        // somthing error
        error.response = response;
        error.status = res.status;
        throw error;
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error; // văng ra 1 lỗi
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
