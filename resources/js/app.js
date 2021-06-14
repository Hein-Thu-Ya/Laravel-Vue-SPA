require('./bootstrap')
import Vue from 'vue';
import Swal from 'sweetalert2';
import VueProgressBar from 'vue-progressbar';
import Loading from 'vue-loading-overlay';

Vue.use(Loading);

Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  thickness: '5px'
})

//Main pages
import ProductComponent from './components/ProductComponent.vue';
Vue.component('pagination', require('laravel-vue-pagination'));

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

window.Swal = Swal;
window.Toast = Toast;

const app = new Vue({
    el: '#app',
    components: { ProductComponent }
});
