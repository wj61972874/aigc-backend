const http = require("./request");
const request = require("request");
const crypto = require("crypto");
const {
  MODAL_TYPE_ENUM,
  config,
  WEXIN_MINIPROGREM_CONFIG,
} = require("./config");

const text2imageConfig = {
  url: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/text2image/sd_xl",
  defaultParams: {
    size: "768x1024",
    n: 1,
    steps: 20,
    sampler_index: "Euler a",
  },
};

const textGenerateConfig = {
  url: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions",
  defaultParams: {
    disable_search: false,
    enable_citation: false,
  },
};

const contentCensorConfig = {
  url: "https://aip.baidubce.com/rest/2.0/solution/v1/text_censor/v2/user_defined",
};

async function handleResolveModalParmas(prompt) {
  console.log("handleResolveModalParmas start");
  return await http.post(text2imageConfig.url, {
    ...text2imageConfig.defaultParams,
    prompt,
  });
}

function matchTextGerenteType(type, message) {
  switch (type) {
    case 1:
      return `生成一个以“${message}”为头的藏头诗，要求是对仗工整`;
    case 2:
      return message;
    default:
      return `生成一个以“${message}”为头的藏头诗，要求是对仗工整`;
  }
}
async function handleResolveTextParmas(type, message) {
  console.log("handleResolveTextParmas start");

  const _messages = [
    {
      role: "user",
      content: matchTextGerenteType(type, message),
    },
  ];
  textGenerateConfig.defaultParams.messages = _messages;
  return await http.post(
    textGenerateConfig.url,
    textGenerateConfig.defaultParams,
    MODAL_TYPE_ENUM.CONTENT_GENERATE
  );
}

async function handleResolveContentCensorParmas(checkData) {
  // const requests = Object.values(checkData).map((value) => {
  //   console.log("handleResolveContentCensorParmas start", value);
  return await http.post(
    contentCensorConfig.url,
    { text: checkData, strategyId: config.CONTENT_CENSOR.strategyId },
    MODAL_TYPE_ENUM.CONTENT_CENSOR,
    {
      Headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  // });

  // const responses = await Promise.all(requests);
  // return responses;
}

// 获取 jsapi_ticket
function getJsapiTicket() {
  return new Promise((resolve, reject) => {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEXIN_MINIPROGREM_CONFIG.APP_ID}&secret=${WEXIN_MINIPROGREM_CONFIG.APP_SECRET}`;

    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const data = JSON.parse(body);
        const accessToken = data.access_token;
        console.log("杰哥测试ticketUrl--000", data)
        const ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
        request(ticketUrl, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            const ticketData = JSON.parse(body);
            console.log("杰哥测试ticketUrl--111", ticketData)
            const jsapi_ticket = ticketData.ticket;
            resolve(jsapi_ticket);
          } else {
            console.log("杰哥测试ticketUrl--", error)
            new Error(`获取微信授权凭证失败： ${response.statusCode}`);
            reject();
          }
        });
      } else {
        console.log("杰哥测试ticketUrl--", error)
        new Error(`获取微信授权token失败： ${response.statusCode}`);
        reject();
      }
    });
  });
}

function getJsapiScheme(){
  return new Promise((resolve, reject) => {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEXIN_MINIPROGREM_CONFIG.APP_ID}&secret=${WEXIN_MINIPROGREM_CONFIG.APP_SECRET}`;

    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const data = JSON.parse(body);
        const accessToken = data.access_token;

        const ticketUrl = `https://api.weixin.qq.com/wxa/generatescheme?access_token=${accessToken}`;
        request.post(ticketUrl, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            // const ticketData = JSON.parse(body);
            // const jsapi_ticket = ticketData.ticket;
            console.log("杰哥测试ticketUrl--", JSON.parse(body))
            resolve('111');
          } else {
            new Error(`获取微信授权凭证失败： ${response.statusCode}`);
            reject();
          }
        });
      } else {
        new Error(`获取微信授权token失败： ${response.statusCode}`);
        reject();
      }
    });
  });
}

// 获取签名
function getSignature(jsapi_ticket, noncestr, timestamp, url) {
  const string = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
  const signature = crypto.createHash("sha1").update(string).digest("hex");
  return signature;
}

module.exports = {
  handleResolveModalParmas,
  handleResolveTextParmas,
  handleResolveContentCensorParmas,
  getJsapiTicket,
  getJsapiScheme,
  getSignature,
};
