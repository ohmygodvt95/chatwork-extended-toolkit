<template>
  <v-app>
    <v-app-bar app absolute color="dark" elevate-on-scroll>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Chatwork Extended Toolkit</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon href="https://github.com" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <v-spacer></v-spacer>
      Made by <a href="https://fb.com/ohmygodvt95" style="margin: 0 5px;">ohmygodvt95</a> with ❤
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>
