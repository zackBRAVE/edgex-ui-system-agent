import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import BootstrapVue3 from 'bootstrap-vue-3'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

app.config.globalProperties.debounce = (fn, interval) => {
  let timer = null
  return function () {
    let context = this
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, interval)
  }
}

app.config.globalProperties.throttle = (fn, interval) => {
  let timer = null
  return function () {
    let context = this
    let args = arguments
    if (!timer) {
      fn.apply(context, args)
      timer = setTimeout(() => {
        clearTimeout(timer)
        timer = null
      }, interval)
    }
  }
}

let alertDict = {}

app.config.globalProperties.createAlert = (message, alertType) => {
  if (alertDict[message + alertType]) {
    return alertDict[message + alertType]
  }

  let wrapper = document.createElement('div')

  wrapper.innerHTML = `<div class="alert alert-${alertType} position-fixed fixed-top text-center rounded-3 mt-3 m-auto p-2 w-25" role="alert"> ${message} </div>`

  document.getElementById('app').append(wrapper)

  wrapper = wrapper.firstChild
  wrapper.style.transition = 'all 0.5s'

  wrapper.show = function () {
    this.style.zIndex = 999
    this.style.opacity = 1
  }

  wrapper.hide = function () {
    this.style.opacity = 0
    this.style.zIndex = -10
  }

  wrapper.changeMessage = function (msg) {
    this.innerText = msg
  }

  wrapper.hide()

  return wrapper
}

app.use(router).use(store).use(BootstrapVue3).mount('#app')
