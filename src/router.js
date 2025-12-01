import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home';
import Steam from './views/Steam';
import Console from './views/Console';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/steam',
            name: 'steam-default',
            component: Steam,
        },
        {
            path: '/steam/:gameId',
            name: 'steam-game',
            component: Steam,
        },
        {
            path: '/steam/:list/:gameId',
            name: 'steam-list-game',
            component: Steam,
        },
        {
            path: '/console',
            name: 'console-default',
            component: Console,
        },
        {
            path: '/console/:gameId',
            name: 'console-game',
            component: Console,
        },
        {
            path: '/console/:list/:gameId',
            name: 'console-list-game',
            component: Console,
        },
    ],
});
