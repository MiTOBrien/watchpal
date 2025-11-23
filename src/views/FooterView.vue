<script setup></script>

<template>
  <footer class="footer">
    <div class="container">
      <p>
        &copy; 2024 WatchPal. All rights reserved. |
        <router-link to="/privacy-policy">Privacy Policy</router-link> |
        <router-link to="/tos">Terms of Service</router-link>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--footer-bg-color);
  color: var(--footer-text-color);
  padding: 1rem 0;
  text-align: center;
  border-top: 1px solid var(--footer-border-color);
}
</style>
