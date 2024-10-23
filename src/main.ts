import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import "primeicons/primeicons.css";

import { VueQueryPlugin } from "vue-query";

import Aura from '@primevue/themes/aura';
import Button from 'primevue/button';
import Column from 'primevue/column';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';


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
app.component('Dialog', Dialog);
app.component('InputText', InputText);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);
app.use(ConfirmationService);
app.use(ToastService);

app.mount('#app')
