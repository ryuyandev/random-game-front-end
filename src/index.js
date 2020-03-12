import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import 'normalize.css'
import 'material-icons/iconfont/material-icons.css'

new Vue({
  el: '#app',
  render: h => h(App),
});