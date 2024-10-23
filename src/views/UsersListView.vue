<script setup lang="ts">
import {
  useGetUsers
} from "@/api";
import DeleteUserDialog from "@/components/DeleteUserDialog.vue";
import UserDialog from "@/components/UserDialog.vue";
import type { IUser } from "@/models";
import { ORDERS_PATH } from "@/router";
import type { DataTableRowClickEvent } from "primevue/datatable";
import { ref } from "vue";
import { useRouter } from "vue-router";

const { data: users, isLoading, error } = useGetUsers();
// const { mutate } = useAddUser()
// const { data: user } = useGetUserById(16);
// const { mutate: updateUser } = useUpdateUser();
// const { mutate: deleteUser } = useDeleteUser();
const router = useRouter();

const showCreateDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);
const selectedUserId = ref<number | null>(null);

const handleAddUser = () => {
  showCreateDialog.value = true;
};

const onRowSelect = (event: DataTableRowClickEvent) => {
  const { id } = event.data as IUser;
  router.push(ORDERS_PATH.replace(":id", id + ""));
};

const onDeleteRow = (event: MouseEvent, userId: number) => {
  event.stopPropagation();
  showDeleteDialog.value = true;
  selectedUserId.value = userId;
};

const onEditRow = (event: MouseEvent, userId: number) => {
  event.stopPropagation();
  selectedUserId.value = userId;
  showCreateDialog.value = true;
};

const handleCloseDeleteDialog = () => {
  showDeleteDialog.value = false;
  selectedUserId.value = null;
};

const handleCloseUserDialog = () => {
  showCreateDialog.value = false;
};
</script>

<template>
  {{ selectedUserId }}
  <Button label="Add User" @click="handleAddUser" />

  <DataTable :value="users" selectionMode="single" @row-click="onRowSelect">
    <Column field="fullName" header="Name"></Column>
    <Column field="email" header="Email"></Column>
    <Column field="createdAt" header="Created At"></Column>
    <Column field="updatedAt" header="Updated At"></Column>
    <Column class="w-24 !text-end">
      <template #body="{ data }">
        <Button
          icon="pi pi-search"
          @click="(event: MouseEvent) => onEditRow(event, data.id)"
          rounded
        ></Button>
      </template>
    </Column>
    <Column class="w-24 !text-end">
      <template #body="{ data }">
        <Button
          icon="pi pi-search"
          @click="(event: MouseEvent) => onDeleteRow(event, data.id)"
          rounded
        ></Button>
      </template>
    </Column>
  </DataTable>

  <UserDialog
    v-if="showCreateDialog"
    :isOpen="showCreateDialog"
    :userId="selectedUserId"
    @close-user-dialog="handleCloseUserDialog"
  />

  <DeleteUserDialog
    :isOpen="showDeleteDialog"
    :userId="selectedUserId"
    @close-delete-dialog="handleCloseDeleteDialog"
  />
</template>

<style scoped></style>
