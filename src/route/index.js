import { createRouter,createWebHashHistory} from "vue-router";

const routes = [
    { 
        path: "/", 
        redirect: "/home" 
    },
    // 首页
    {
        path: "/home",
        name: "home",
        component:() => import('@/views/home/index.vue')
    },
    // pointlayer 点图层
    {
        path: "/pointlayer",
        name: "pointlayer",
        component:() => import('@/views/pointlayer/index.vue')
    },
    // laserlayer 激光图层
    {
        path: "/laserlayer",
        name: "laserlayer",
        component:() => import('@/views/laserlayer/index.vue')
    },
     // masklayer 掩膜图层
     {
        path: "/masklayer",
        name: "masklayer",
        component:() => import('@/views/masklayer/index.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router