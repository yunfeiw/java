const koa = require('koa')
const router = require('koa-router')();
const bodyParser =  require("koa-bodyparser");
const app = new koa()

app.use(bodyParser())
router.get('/api/getname', ctx => {
    ctx.body = {
        name: '云飞'
    }
})
router.post('/api/postname', ctx => {
    console.log(ctx.request.body)
    ctx.body = {
        name: '云飞'
    }
})

app.use(router.routes());

app.listen(8082, err => {
    console.log('情动完成')
})