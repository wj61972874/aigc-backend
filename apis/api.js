const Router = require("koa-router");
const {
  handleResolveModalParmas,
  handleResolveTextParmas,
  handleResolveContentCensorParmas,
} = require("./modalServices");

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

module.exports = router;
