const Koa = require("koa");
const router = require("./apis/api");
const parser = require("koa-bodyparser");
const cors = require("koa2-cors");

const app = new Koa();

//设置允许跨域
app.use(cors());

app.use(parser());

app.use(router.routes());

// 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
