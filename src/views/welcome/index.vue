<script setup lang="ts">
import router from "@/router";

defineOptions({
  name: "Welcome"
});

const onClick = () => {
  router.push({ name: "供需收集" });
};
</script>

<template>
  <h1 @click="onClick">供需填写</h1>
</template>
