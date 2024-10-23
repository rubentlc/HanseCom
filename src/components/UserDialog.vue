<script setup lang="ts">
import { useAddUser, useGetUserById, useUpdateUser } from "@/api";
import { useToast } from "primevue/usetoast";
import { computed, ref, watch } from "vue";

const { isOpen, userId } = defineProps<{
  isOpen: boolean;
  userId?: number | null | undefined;
}>();

console.log("get, userId", userId);

const emit = defineEmits(["close-user-dialog"]);

const userNameRef = ref(null);
const userEmailRef = ref(null);
const userPasswordRef = ref<number | null | undefined>(null);

const toast = useToast();

const {
  mutate: addUser,
  error: errorCreatingUser,
  isSuccess: successCreatingUser,
} = useAddUser();

const {
  mutate: updateUser,
  error: errorUpdatingUser,
  isSuccess: successUpdatingUser,
} = useUpdateUser();

const { data: userData } = useGetUserById(userId);

const createBtnEnabled = computed(() => {
  if (userId) {
    return Boolean(userNameRef.value && userEmailRef.value);
  }
  return Boolean(
    userNameRef.value && userEmailRef.value && userPasswordRef.value
  );
});

const handleSubmitUser = () => {
  if (userId) {
    updateUser({
      id: userId,
      fullName: userNameRef.value,
      email: userEmailRef.value,
    });
  } else {
    addUser({
      fullName: userNameRef.value,
      email: userEmailRef.value,
      password: userPasswordRef.value,
    });
  }
};

const handleCloseDialog = () => {
  userNameRef.value = null;
  userEmailRef.value = null;
  userPasswordRef.value = null;
  emit("close-user-dialog");
};

watch([successCreatingUser, successUpdatingUser], () => {
  if (successCreatingUser.value || successUpdatingUser.value) {
    handleCloseDialog();

    toast.add({
      severity: "info",
      summary: "Confirmed",
      detail: userId ? "User updated!" : "User added!",
      life: 3000,
    });
  }
});

watch(userData, () => {
  if (userData) {
    userNameRef.value = userData.value.fullName;
    userEmailRef.value = userData.value.email;
  }
});
</script>

<template>
  <Toast />
  <Dialog
    v-bind:visible="isOpen"
    modal
    :header="userId ? 'Edit User' : 'Create User'"
    :style="{ width: '30rem' }"
    :closable="false"
  >
    <p
      v-if="errorCreatingUser || errorUpdatingUser"
      class="text-surface-500 dark:text-surface-400 block mb-8"
    >
      {{ errorCreatingUser || errorUpdatingUser }}
    </p>

    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">Name</label>
      <InputText
        id="username"
        class="flex-auto"
        autocomplete="off"
        v-model="userNameRef"
      />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="email" class="font-semibold w-24">Email</label>
      <InputText
        id="email"
        class="flex-auto"
        autocomplete="off"
        v-model="userEmailRef"
      />
    </div>
    <div v-if="!userId" class="flex items-center gap-4 mb-8">
      <label for="password" class="font-semibold w-24">Password</label>
      <InputText
        id="password"
        type="password"
        class="flex-auto"
        autocomplete="off"
        v-model="userPasswordRef"
      />
    </div>
    <div class="flex justify-end gap-2">
      <Button label="Cancel" @click="handleCloseDialog()" />
      <Button
        label="Save"
        :disabled="!createBtnEnabled"
        @click="handleSubmitUser"
      />
    </div>
  </Dialog>
</template>
