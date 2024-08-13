import { resolve } from 'path';
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve),
                },
            ]
        },
        {
            path: '/dashboard',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/search',
                    component: resolve => require(['../components/page/search.vue'], resolve),
                },
                {
                    path: '/searchParam',
                    component: resolve => require(['../components/page/searchParam.vue'], resolve),
                }
            ]
        },
        {
            path: '/card',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/',
                    component: resolve => require(['../components/page/card.vue'], resolve),
                },
            ]
        },
        {
            path: '/searchIP',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/',
                    component: resolve => require(['../components/page/searchIP.vue'], resolve),
                },
            ]
        },
        {
            path: '/vs',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/',
                    component: resolve => require(['../components/page/vs.vue'], resolve),
                },
            ]
        },
        {
            path: '/searchBug',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/',
                    component: resolve => require(['../components/page/searchBug.vue'], resolve),
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
