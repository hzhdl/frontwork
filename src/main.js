import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from './App'
import 'ant-design-vue/dist/antd.css'
import router from './router/index'
import store from './store/index'


const app = createApp(App)

app.use(router).use(Antd).use(store).mount('#app')
