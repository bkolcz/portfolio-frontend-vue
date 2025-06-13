<script setup lang="ts">
import "./styles/app.scss";
import { RouterLink, RouterView } from "vue-router";

</script>

<template>
  <header class="header-general">
    portfolio-frontend-vue
  </header>
  <nav class="navbar mb-1">
    <RouterLink to="/" class="nav-item">Home</RouterLink>
    <RouterLink to="/tree" class="nav-item">Tree application</RouterLink>
    <RouterLink to="/about" class="nav-item">About</RouterLink>
  </nav>

  <RouterView />
</template>