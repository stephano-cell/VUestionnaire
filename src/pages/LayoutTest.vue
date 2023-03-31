<template>
  <div class="q-pa-md">
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 700px"
      class="shadow-2 rounded-borders"
    >
      <q-header elevated>
        <q-toolbar>
          <!-- <q-btn flat round dense icon="menu" class="q-mr-sm" /> -->
          <q-toolbar-title>VUestionnaire</q-toolbar-title>
        </q-toolbar>

        <q-tabs>
          <q-tab name="users" label="users" />
          <q-tab name="new_user" label="new user" />
          <q-tab name="create_project" label="create project" />
          <q-tab name="view_projects" label="view projects" />
        </q-tabs>
      </q-header>

      <q-page-container>
        <q-page class="q-pa-md">
          <p></p>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
