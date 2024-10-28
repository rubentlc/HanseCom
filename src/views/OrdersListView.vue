<script setup lang="ts">
import { useGetOrders } from "@/api";
import UpInsertOrderDialog from '@/components/UpInsertOrderDialog.vue';
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { id: userId } = route.params;

const { data: orders, isLoading, error } = useGetOrders(Number(userId));

const showCreateDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);
const selectedOrderId = ref<number | null>(null);

const handleAddOrder = () => {
  showCreateDialog.value = true;
};

const handleCloseUpInserOrderDialog = () => {
  showCreateDialog.value = false;
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
        <!-- <Button
          icon="pi pi-user-edit"
          @click="(event: MouseEvent) => onEditRow(event, data.id)"
          rounded
        ></Button> -->
      </template>
    </Column>
    <Column class="w-5 !text-end">
      <template #body="{ data }">
        <!-- <Button
          icon="pi pi-times"
          @click="(event: MouseEvent) => onDeleteRow(event, data.id)"
          rounded
        ></Button> -->
      </template>
    </Column>
  </DataTable>

  <UpInsertOrderDialog
    v-if="showCreateDialog"
    :isOpen="showCreateDialog"
    :userId="(userId as string)"
    :orderId="selectedOrderId"
    @on-close="handleCloseUpInserOrderDialog"
  />
</template>

<style scoped></style>
