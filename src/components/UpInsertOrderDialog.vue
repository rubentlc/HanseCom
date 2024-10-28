<script setup lang="ts">
import { useAddOrder, useGetOrderById, useUpdateOrder } from "@/api";
import { useToast } from "primevue/usetoast";
import { computed, ref, watch } from "vue";

const { isOpen, userId, orderId } = defineProps<{
  isOpen: boolean;
  userId: string;
  orderId?: number | null | undefined;
}>();

const emit = defineEmits(["on-close"]);

const orderProductRef = ref(null);
const orderDateRef = ref(null);

const toast = useToast();

const {
  mutate: addOrder,
  error: errorCreatingOrder,
  isSuccess: successCreatingOrder,
} = useAddOrder();

const {
  mutate: updateOrder,
  error: errorUpdatingOrder,
  isSuccess: successUpdatingOrder,
} = useUpdateOrder();

const { data: orderData } = useGetOrderById(orderId);

const createBtnEnabled = computed(() => {
  return Boolean(orderProductRef.value && orderDateRef.value);
});

const handleSubmitOrder = () => {
  // if (orderId) {
  //   updateOrder({
  //     id: orderId,
  //     fullName: userNameRef.value,
  //     email: orderProductRef.value,
  //   });
  // } else {
    addOrder({
      user: userId,
      orderDate: orderDateRef.value,
      product: orderProductRef.value
    });
  // }
};

const handleCloseDialog = () => {
  orderDateRef.value = null;
  orderProductRef.value = null;
  emit("on-close");
};

watch([successCreatingOrder, successUpdatingOrder], () => {
  if (successCreatingOrder.value || successUpdatingOrder.value) {
    handleCloseDialog();

    toast.add({
      severity: "info",
      summary: "Confirmed",
      detail: orderId ? "Order updated!" : "Order added!",
      life: 3000,
    });
  }
});

watch(orderData, () => {
  if (orderData) {
    // userNameRef.value = orderData.value.fullName;
    // orderProductRef.value = orderData.value.email;
  }
});
</script>

<template>
  <Toast />
  <Dialog
    v-bind:visible="isOpen"
    modal
    :header="orderId ? 'Edit Order' : 'Create Order'"
    :style="{ width: '30rem' }"
    :closable="false"
  >
    <p
      v-if="errorCreatingOrder || errorUpdatingOrder"
      class="text-surface-500 dark:text-surface-400 block mb-8"
    >
      {{ errorCreatingOrder || errorUpdatingOrder }}
    </p>

    <div class="flex items-center gap-4 mb-4">
      <label for="date" class="font-semibold w-24">Date</label>
      <DatePicker
        v-model="orderDateRef" 
        date-format="dd/mm/yy"
      />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="product" class="font-semibold w-24">Product</label>
      <InputText
        id="product"
        class="flex-auto"
        autocomplete="off"
        v-model="orderProductRef"
      />
    </div>
    <div class="flex justify-end gap-2">
      <Button label="Cancel" @click="handleCloseDialog()" />
      <Button
        label="Save"
        :disabled="!createBtnEnabled"
        @click="handleSubmitOrder"
      />
    </div>
  </Dialog>
</template>
