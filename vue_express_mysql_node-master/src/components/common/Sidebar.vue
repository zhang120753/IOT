<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title" ><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" >{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" width:80px>
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: 'readme',
                        title: '简介',
                    },
                    {
                        icon: 'el-icon-setting',
                        index: 'card',
                        title: '网卡选择扫描',
                    },
                    {
                        icon: 'el-icon-setting',
                        index: 'searchIP',
                        title: '网段存活主机扫描',
                    },
                    {
                        icon: 'el-icon-setting',
                        index: 'dashboard',
                        title: '主机端口扫描',
                        subs: [
                            {
                                index: 'search',
                                title: '扫描'
                            },
                            {
                                index: 'searchParam',
                                title: '参数选择扫描'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-setting',
                        index: 'vs',
                        title: '两主机扫描对比',
                    },
                    {
                        icon: 'el-icon-setting',
                        index: 'searchBug',
                        title: '主机漏洞扫描',
                    },
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 165px;
        left: 0;
        top: 70px;
        bottom:0;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
