<script setup lang="ts">
import { useGetUsers } from "@/api";
import DeleteUserDialog from "@/components/DeleteUserDialog.vue";
import UpInsertUserDialog from "@/components/UpInsertUserDialog.vue";
import type { IUser } from "@/models";
import { ORDERS_PATH } from "@/router";
import type { DataTableRowClickEvent } from "primevue/datatable";
import { ref } from "vue";
import { useRouter } from "vue-router";

const { data: users, isLoading, error } = useGetUsers();
const router = useRouter();

const showUpInsertDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);
const selectedUserId = ref<number | null>(null);

const handleAddUser = () => {
  showUpInsertDialog.value = true;
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
  showUpInsertDialog.value = true;
};

const handleCloseDeleteDialog = () => {
  showDeleteDialog.value = false;
  selectedUserId.value = null;
};

const handleCloseUpInserUserDialog = () => {
  showUpInsertDialog.value = false;
  selectedUserId.value = null;
};
</script>

<template>
  <Button label="Add User" @click="handleAddUser" />

  <DataTable :value="users" selectionMode="single" @row-click="onRowSelect">
    <Column field="fullName" header="Name"></Column>
    <Column field="email" header="Email"></Column>
    <Column field="createdAt" header="Created At"></Column>
    <Column field="updatedAt" header="Updated At"></Column>
    <Column class="w-5 !text-end">
      <template #body="{ data }">
        <Button
          icon="pi pi-user-edit"
          @click="(event: MouseEvent) => onEditRow(event, data.id)"
          rounded
        ></Button>
      </template>
    </Column>
    <Column class="w-5 !text-end">
      <template #body="{ data }">
        <Button
          icon="pi pi-times"
          @click="(event: MouseEvent) => onDeleteRow(event, data.id)"
          rounded
        ></Button>
      </template>
    </Column>
  </DataTable>

  <UpInsertUserDialog
    v-if="showUpInsertDialog"
    :isOpen="showUpInsertDialog"
    :userId="selectedUserId"
    @on-close="handleCloseUpInserUserDialog"
  />
  
  <DeleteUserDialog
    :isOpen="showDeleteDialog"
    :userId="selectedUserId"
    @on-close="handleCloseDeleteDialog"
  />
</template>

<style scoped></style>
