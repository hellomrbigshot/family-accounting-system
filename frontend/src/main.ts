import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import {
  Button,
  Cell,
  CellGroup,
  Dialog,
  Field,
  Form,
  Icon,
  NavBar,
  Popup,
  Tabbar,
  TabbarItem,
  Toast,
  DatePicker,
  NumberKeyboard
} from 'vant'
import './main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Button)
app.use(Cell)
app.use(CellGroup)
app.use(Dialog)
app.use(Field)
app.use(Form)
app.use(Icon)
app.use(NavBar)
app.use(Popup)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Toast)
app.use(DatePicker)
app.use(NumberKeyboard)

app.mount('#app')
