const Router = require("koa-router");
const {
  handleResolveModalParmas,
  handleResolveTextParmas,
  handleResolveContentCensorParmas,
  getJsapiTicket,
  getJsapiScheme,
  getSignature,
} = require("./modalServices");
const {
  WEXIN_MINIPROGREM_CONFIG,
} = require("./config");


const router = new Router({ prefix: "/api" });

// GET 请求接口
router.get("/api/get/test", async (ctx) => {
  ctx.body = "This is a GET request test endpoint";
});

// POST 请求接口
router.post("/aigc/text2Image", async (ctx) => {
  const { prompt } = ctx.request.body;
  console.log("文生图参数入参---", prompt);
  //   ctx.body = "This is a POST request test endpoint";
  //处理Stable-Diffusion-XL模型prompt数据
  const res = await handleResolveModalParmas(prompt);
  ctx.body = res;
});

// 文案生成
router.post("/aigc/textGenerate", async (ctx) => {
  const { type, messages } = ctx.request.body;
  console.log("文案生成参数入参---", type, messages);
  //   ctx.body = "This is a POST request test endpoint";
  //处理Stable-Diffusion-XL模型prompt数据
  const res = await handleResolveTextParmas(type, messages);
  ctx.body = res;
});

//内容审核
router.post("/aigc/contentCensor", async (ctx) => {
  const { text } = ctx.request.body;
  console.log("内容审核参数入参---", text);
  //   ctx.body = "This is a POST request test endpoint";
  //处理Stable-Diffusion-XL模型prompt数据
  const res = await handleResolveContentCensorParmas(text);
  ctx.body = res;
});

// 保存订单
router.post("/aigc/saveOrder", async (ctx) => {
  const { text } = ctx.request.body;
  console.log("内容审核参数入参---", text);
  //   ctx.body = "This is a POST request test endpoint";
  //处理Stable-Diffusion-XL模型prompt数据
  const res = await handleResolveContentCensorParmas(text);
  ctx.body = res;
});

//获取微信签名
router.get("/aigc/wechatJsapi/ticket/get", async (ctx) => {
  const { url } = ctx.request.query;
  const decodedUrl = decodeURIComponent(url);
  console.log("请求 URL:", decodedUrl);
  // 处理获取 jsapi_ticket 的逻辑
  const jsapi_ticket = await getJsapiTicket();
  console.log("请求 URL jsapi_ticket:", jsapi_ticket);
  // 计算签名
  const noncestr = Math.random().toString(36).substr(2, 15);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = getSignature(jsapi_ticket, noncestr, timestamp, decodedUrl);

  // 返回签名等数据
  ctx.body = {
    appId:WEXIN_MINIPROGREM_CONFIG.APP_ID,
    signature,
    noncestr,
    timestamp,
    jsapi_ticket,
  };
});

//获取微信小程序scheme
router.get("/aigc/wechatJsapi/scheme/get", async (ctx) => {
  // 处理获取 jsapi_ticket 的逻辑
  const schemeLink = await getJsapiScheme();
  console.log("请求 URL schemeLink:", schemeLink);
  // 返回签名等数据
  ctx.body = {
    schemeLink
  };
});

module.exports = router;
