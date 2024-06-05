const request = require("request");
const { config, MODAL_TYPE_ENUM } = require("./config");

const http = {
  post: sendPostRequest,
};

const successRes = {
  code: 200,
  message: "success",
  result: null,
};

const errorRes = {
  code: 500,
  message: "发生错误啦~",
  result: null,
};

/**
 * 发送 POST 请求
 * @param {string} url 请求的 URL
 * @param {object} data 请求的数据
 * @returns {Promise<object>} 响应数据
 */
async function sendPostRequest(url, data, modalType, httpOptions) {
  const accessToken = await getAccessToken(modalType);
  let headers = httpOptions?.headers || {};
  console.log("--headers", headers);
  const options = {
    method: "POST",
    url: url + "?access_token=" + accessToken,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    [config[modalType].apiContentType]:
      modalType === MODAL_TYPE_ENUM.CONTENT_GENERATE
        ? JSON.stringify(data)
        : data,
  };
  console.log("--options", options);

  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        // reject(errorRes);
        console.log("--reject error-", error);
        resolve(errorRes);
      } else {
        console.log("--response-", response?.body);
        const resultData = JSON.parse(response?.body);
        if (resultData?.error_code) {
          resolve(errorRes);
        } else {
          resolve({ ...successRes, result: resultData });
        }
      }
    });
  });
}

/**
 * 使用 AK、SK 生成鉴权签名（Access Token）
 * @return {Promise<string>} 鉴权签名信息（Access Token）
 */
function getAccessToken(modalType) {
  const options = {
    method: "POST",
    url: "https://aip.baidubce.com/oauth/2.0/token",
    qs: {
      grant_type: "client_credentials",
      client_id: config[modalType].client_id,
      client_secret: config[modalType].client_secret,
    },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(response.body).access_token);
      }
    });
  });
}

module.exports = http;
