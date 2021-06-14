<template>
  <div class="container my-5">
      <div class="row justify-content-end">
          <div class="col-md-4">
              <button class="btn btn-primary btn-md" @click="create"><i class="fas fa-plus"></i> Create</button>
              <button @click="clean" class="btn btn-danger"><i class="fas fa-sync-alt"></i></button>
          </div>
          <div class="col-md-4">
            <form @submit.prevent="view">
                <div class="input-group mb-3">
                    <input type="text" v-model="search" class="form-control" placeholder="Search">
                    <button class="btn btn-primary" type="submit"><i class="fas fa-search"></i></button>
                </div>
            </form>
          </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-4">
            <div class="card">
                <div class="card-header"><h3>{{ isEditMode ? 'Edit' : 'Create' }}</h3></div>
                <div class="card-body">
                    <form @submit.prevent="isEditMode ? update() : store()" @keydown="product.onKeydown($event)">
                        <AlertError :form="product" :message="message" />
                        <div class="form-group mb-3">
                            <label class="form-label">Name:</label>
                            <input v-model="product.name" name="name" type="text" class="form-control">
                            <div v-if="product.errors.has('name')" class="text-danger" v-html="product.errors.get('name')" />
                        </div>
                        <div class="form-group mb-3">
                            <label class="form-label">Price:</label>
                            <input v-model="product.price" name="price" type="number" class="form-control">
                            <div v-if="product.errors.has('price')" class="text-danger" v-html="product.errors.get('price')" />
                        </div>
                        <button class="btn btn-primary" :disabled="product.busy" type="submit"><i class="fas fa-save"></i> Save</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-md-8">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Name</td>
                        <td>Price</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products.data" :key="product.id">
                        <td>{{ product.id }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.price }}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" @click="edit(product)"><i class="fas fa-pencil-alt"></i> Edit</button>
                            <button class="btn btn-danger btn-sm" @click="destroy(product.id)"><i class="fas fa-trash"></i> Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <pagination :data="products" @pagination-change-page="view"></pagination>
        </div>
      </div>
  </div>
</template>

<script>
import Form from 'vform'
import { Button, HasError, AlertError } from 'vform/src/components/bootstrap5'

export default {
    name: 'ProductComponent',
    components: {
        Button, HasError, AlertError
    },
    data() {
        return {
            products: {},
            isEditMode: false,
            search: '',
            message: '',
            product: new Form({
                id: '',
                name: '',
                price: ''
            }),
        }
    },
    methods: {
        clean(){
            this.search = '',
            this.view()
        },
        view(page = 1) {
            let loader = this.$loading.show({
                color: 'blue',
                width: '45px',
                height: '45px',
                loader: 'bars',
            });

            this.$Progress.start();
            axios.get(`/api/product?page=${page}&search=${this.search}`)
            .then(response => {
                this.products = response.data;
                this.$Progress.finish();
                loader.hide();
            })
            .catch(error => {
                this.$Progress.fail();
                loader.hide();
            })
        },
        create() {
            this.product.clear(),
            this.isEditMode = false,
            this.product.id = '',
            this.product.name = '',
            this.product.price = ''
        },
        store() {
            // axios.post('/api/product', this.product)
            this.product.post('/api/product')
            .then(response => {
                this.view()
                Toast.fire({
                    icon: 'success',
                    title: 'Created successfully'
                })
                this.product.id = '',
                this.product.name = '',
                this.product.price = ''
            })
            .catch(error => {
                this.message = error.response.data.message
            })
        },
        edit(product) {
            this.product.clear(),
            this.isEditMode = true,
            this.product.id = product.id,
            this.product.name = product.name,
            this.product.price = product.price
        },
        update() {
            // axios.put(`/api/product/${this.product.id}`, this.product)
            this.product.put(`/api/product/${this.product.id}`)
            .then(response => {
                this.view()
                Toast.fire({
                    icon: 'success',
                    title: 'Updated successfully'
                })
                this.product.id = '',
                this.product.name = '',
                this.product.price = ''
            })
            .catch(error => {
                this.message = error.response.data.message
            })
        },
        destroy(id) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`/api/product/${id}`)
                    .then(response => {
                        this.view();
                        Toast.fire({
                            icon: 'success',
                            title: 'Deleted successfully'
                        })
                    })
                }
            })
        }
    },
    created() {
        this.view()
    }
}
</script>

<style>

</style>
