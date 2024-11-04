<script setup lang="ts">
import { useGetOrders } from "@/api";
import DeleteOrderDialog from '@/components/DeleteOrderDialog.vue';
import UpInsertOrderDialog from '@/components/UpInsertOrderDialog.vue';
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { id: userId } = route.params;

const { data: orders, isLoading, error } = useGetOrders(Number(userId));

const showUpInsertDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);
const selectedOrderId = ref<number | null>(null);

const handleAddOrder = () => {
  showUpInsertDialog.value = true;
};

const onEditRow = (event: MouseEvent, orderId: number) => {
  event.stopPropagation();
  selectedOrderId.value = orderId;
  showUpInsertDialog.value = true;
};

const onDeleteRow = (event: MouseEvent, orderId: number) => {
  event.stopPropagation();
  showDeleteDialog.value = true;
  selectedOrderId.value = orderId;
};

const handleCloseUpInserOrderDialog = () => {
  showUpInsertDialog.value = false;
  selectedOrderId.value = null;
};

const handleCloseDeleteDialog = () => {
  showDeleteDialog.value = false;
  selectedOrderId.value = null;
};

</script>

<template>
  {{  "userId: " + userId }}
  <Button label="Add Order" @click="handleAddOrder" />

  <DataTable :value="orders">
    <Column field="order_date" header="Order Date"></Column>
    <Column field="product" header="Product"></Column>
    <Column field="created_at" header="Created At"></Column>
    <Column field="updated_at" header="Updated At"></Column>
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

  <UpInsertOrderDialog
    v-if="showUpInsertDialog"
    :isOpen="showUpInsertDialog"
    :userId="(userId as string)"
    :orderId="selectedOrderId"
    @on-close="handleCloseUpInserOrderDialog"
  />

  <DeleteOrderDialog
    :isOpen="showDeleteDialog"
    :orderId="selectedOrderId"
    @on-close="handleCloseDeleteDialog"
  />
</template>

<style scoped></style>
