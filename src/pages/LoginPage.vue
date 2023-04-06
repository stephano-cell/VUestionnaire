<template>
  <div class="fixed-center">
    <h4>VUestionnaire</h4>
    <div class="q-pa-md">
      <div class="q-gutter-md" style="max-width: 500px">
        <q-input rounded outlined v-model="username" label="username *" />
        <q-input filled v-model="email" type="email" label="e-mail *" />
        <q-input filled v-model="password" type="password" label="password *" />
      </div>
      <div class="q-pa-md q-gutter-sm">
        <q-btn color="blue" text-color="white" label="Login" />
      </div>
    </div>
  </div>
</template>
