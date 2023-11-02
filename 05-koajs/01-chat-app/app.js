const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = [];

router.get('/subscribe', async (ctx, next) => {
  const promise = new Promise((resolve, reject) => {
    subscribers.push(resolve);
  });

  ctx.body = await promise;
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;

  if (!message) ctx.throw(400);

  for (const resolve of subscribers) {
    resolve(message);
  }

  subscribers = [];

  ctx.body = 'success';
});

app.use(router.routes());

module.exports = app;
