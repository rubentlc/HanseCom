import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { VueQueryPlugin } from "vue-query";

import Aura from '@primevue/themes/aura';
import Button from 'primevue/button';
import Column from 'primevue/column';
import PrimeVue from 'primevue/config';
import DataTable from 'primevue/datatable';

const app = createApp(App)
app.use(router);
app.use(VueQueryPlugin);

app.use(PrimeVue, {
  theme: {
      preset: Aura
  }
});
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Button', Button);

app.mount('#app')
