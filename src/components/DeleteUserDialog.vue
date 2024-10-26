<script setup lang="ts">
import { useDeleteUser } from "@/api";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { watch } from "vue";

const { isOpen, userId } = defineProps<{
  isOpen: boolean;
  userId: number | null;
}>();

const emit = defineEmits(["on-close"]);

const confirm = useConfirm();
const toast = useToast();

const { mutate: deleteUser, isSuccess } = useDeleteUser();

watch(
  () => isOpen,
  () => {
    if (!isOpen) {
      emit("on-close");
      confirm.close();
      return;
    }

    confirm.require({
      modal: true,
      message: "Are you sure you want to delete the selected user?",
      header: "Delete user",
      rejectLabel: "Cancel",
      rejectProps: {
        label: "Cancel",
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: "Delete",
        severity: "danger",
      },
      accept: () => {
        emit("on-close");
        if (userId) {
          deleteUser(userId);
        }
      },
      reject: () => {
        emit("on-close");
      },
    });
  }
);

watch(isSuccess, () => {
  if (isSuccess.value) {
    toast.add({
      severity: "info",
      summary: "Confirmed",
      detail: "Record deleted",
      life: 3000,
    });
  }
});
</script>

<template>
  <Toast />
  <ConfirmDialog>
    <template #message="slotProps">
      <div
        class="flex flex-col items-center w-full gap-4 border-b border-surface-200 dark:border-surface-700"
      >
        <i
          :class="slotProps.message.icon"
          class="!text-6xl text-primary-500"
        ></i>
        <p>{{ slotProps.message.message }}</p>
      </div>
    </template>
  </ConfirmDialog>
</template>
