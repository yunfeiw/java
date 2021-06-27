const Koa = require('koa')
const fs = require('fs')
const path = require('path');

// 编译.vue
const compilerSfc = require('@vue/compiler-sfc')
const compilerDom = require('@vue/compiler-dom')

const app = new Koa();

app.use(async (ctx) => {
    const { request: { url, query } } = ctx;

    if (url === '/') {
        // 匹配html
        ctx.type = 'text/html';
        const content = fs.readFileSync('./index.html', 'utf-8');;
        ctx.body = content.replace('<script ', `
            <script>
                window.process = {
                    env:{
                        NODE_ENV:'dev'
                    }
                }
            </script>
            <script
        `)
    } else if (url.endsWith('.js')) {
        // 匹配js
        const p = path.resolve(__dirname, url.slice(1));
        ctx.type = 'application/javascript';
        ctx.body = rewriteimport(fs.readFileSync(p, 'utf-8'));
    } else if (url.startsWith('/@module/')) {
        // 匹配模块
        const prefix = path.resolve(__dirname, 'node_modules', url.replace('/@module/', ''));
        const module = require(prefix + '/package.json').module;
        const p = path.resolve(prefix, module);
        const res = fs.readFileSync(p, 'utf-8');
        ctx.type = 'application/javascript';
        // 注意 res 内也需要 进行 配置
        ctx.body = rewriteimport(res);
    } else if (url.indexOf('.vue') > -1) {
        const p = path.resolve(__dirname, url.split('?')[0].slice(1));
        const { descriptor } = compilerSfc.parse(fs.readFileSync(p, 'utf-8'));

        if (!query.type) {

            ctx.type = 'application/javascript';
            ctx.body = `${rewriteimport(
                descriptor.script.content.replace('export default', 'const __script = ')
            )}
            import {render as __render} from '${url}?type=template'
            
                __script.render = __render
                export default __script
            `
        } else {
            ctx.type = 'application/javascript';
            const render = compilerDom.compile(descriptor.template.content, {
                mode: 'module'
            }).code;
            ctx.body = rewriteimport(render);

        }

    } else if (url.endsWith('.css')) {
        const p = path.resolve(__dirname,url.slice(1));
        const file = fs.readFileSync(p,'utf-8');
        const content = `
            const css = \`${file.replace(/\n/g,'')}\`;
            const link = document.createElement('style');
            link.setAttribute('type','text/css');
            document.head.appendChild(link);
            link.innerHTML = css;
            export default css;
        `
        ctx.type = 'application/javascript';
        ctx.body = content;
    }
})

app.listen(8082, (err) => {
    console.log(err, 'success');
})


// 匹配 src下content替换 import 包 为 node_module

function rewriteimport(content) {
    return content.replace(/ from ['|"]([^'"]+)['|"]/g, function (s0, s1) {
        if (s1[0] !== '.' && s1[1] !== '/') {
            return `from '/@module/${s1}'`;
        } else {
            return s0
        }
    })
}

