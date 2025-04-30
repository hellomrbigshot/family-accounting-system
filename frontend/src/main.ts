import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { 
  Form, 
  Field, 
  CellGroup, 
  RadioGroup, 
  Radio, 
  DatePicker, 
  Stepper, 
  Button, 
  Popup, 
  Picker,
  Toast
} from 'vant'
import 'vant/lib/index.css'
import './main.css'

const app = createApp(App)

// 注册 Vant 组件
app.use(Form)
app.use(Field)
app.use(CellGroup)
app.use(RadioGroup)
app.use(Radio)
app.use(DatePicker)
app.use(Stepper)
app.use(Button)
app.use(Popup)
app.use(Picker)
app.use(Toast)

app.use(createPinia())
app.use(router)
app.mount('#app')
