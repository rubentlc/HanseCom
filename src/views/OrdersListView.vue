<script setup lang="ts">

import { useGetOrders, useUpdateOrder } from '@/api';
import type { DataTableRowSelectEvent } from 'primevue/datatable';
import { useRoute } from 'vue-router';

const route = useRoute();
console.log()
const { id: userId } = route.params

const { data, isLoading, error } = useGetOrders(Number(userId))
// const { data: order } = useGetOrderById(25)
const { mutate } = useUpdateOrder()

const handleSubmit = () => {
  mutate(27)
}

const onRowSelect = (event: DataTableRowSelectEvent) => {
    console.log("event", event.data)
};

</script>

<template>
    <DataTable :value="data" selectionMode="single" @rowSelect="onRowSelect">
      <Column field="order_date" header="Order Date"></Column>
      <Column field="product" header="product"></Column>
    </DataTable>

    <Button label="Submit" v-on:click="handleSubmit" />
</template>

<style scoped></style>
