import { createRouter,createWebHashHistory } from 'vue-router'

import edit_vfor from '../views/edit_vfor'
import hightable from '../views/hightable'
const routes = [
  { path: '/', component: edit_vfor },
  { path: '/highlevel', component: hightable },
  // { path: '/details', component: Details },
]

// 3. 创建路由实例并传递 `routes` 配置。
const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

export default router;
