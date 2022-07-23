import { createApp, getCurrentInstance  } from 'vue'

import './styles/basic.scss'
// 导入路由
import router from './router/index'
// elementplus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import'./styles/element.scss'
// 汉化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
const app = createApp(App);
// 全局引入element图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
import SvgIcon from './components/SvgIcon/index.vue';
app.use(SvgIcon)
// 全局配色
import './styles/light.scss'
// 全局引入store
import store from './store/index'
// 全局注册message提示框
import { ElMessage } from 'element-plus'
window.$message = ElMessage;
app
.use(router)
.use(store)
.use(ElementPlus, {
    locale: zhCn
})
.mount('#app')
