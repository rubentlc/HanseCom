<script setup lang="ts">

import { useAddUser, useDeleteUser, useGetUserById, useGetUsers, useUpdateUser } from '@/api';
import type { IUser } from '@/models';
import { ORDERS_PATH } from '@/router';
import type { DataTableRowSelectEvent } from 'primevue/datatable';
import { useRouter } from 'vue-router';

const { data, isLoading, error } = useGetUsers()
const { mutate } = useAddUser()
const { data: user } = useGetUserById(16)
const { mutate: updateUser } = useUpdateUser()
const { mutate: deleteUser } = useDeleteUser()
const router = useRouter()

const handleSubmit = () => {
  // mutate();
  // updateUser(16);
  // deleteUser(15)
}

const onRowSelect = (event: DataTableRowSelectEvent) => {
  const { id } = event.data as IUser;
  router.push(ORDERS_PATH.replace(':id', id + ''));
};

</script>

<template>
  {{ user }}
    <DataTable :value="data" selectionMode="single" @rowSelect="onRowSelect">
      <Column field="fullName" header="Name"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="createdAt" header="Created At"></Column>
      <Column field="updatedAt" header="Updated At"></Column>
    </DataTable>

    <Button label="Submit" v-on:click="handleSubmit" />
</template>

<style scoped></style>
