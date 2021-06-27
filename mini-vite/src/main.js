import { createApp } from 'vue'
import Wang from './view/wang.vue';

import { yunfei } from './assets/js/yunfei.js'
import  './assets/app.css';

console.log('我是 main');
// 调用方法
yunfei();
// 挂载组件
createApp(Wang).mount(document.querySelector('#app'));