<script setup lang="ts">
import "./styles/app.scss";
import { RouterLink, RouterView } from "vue-router";

</script>

<template>
  <header>
    Welcome to portfolio-frontend-vue project.
  </header>
  <nav class="nav-general">
    <RouterLink to="/" class="nav-item">Home</RouterLink>
    <RouterLink to="/tree" class="nav-item">Tree application</RouterLink>
    <RouterLink to="/about" class="nav-item">About</RouterLink>
  </nav>

  <RouterView />
</template>