const http = require("./request");
const { MODAL_TYPE_ENUM, config } = require("./config");

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
module.exports = {
  handleResolveModalParmas,
  handleResolveTextParmas,
  handleResolveContentCensorParmas,
};
