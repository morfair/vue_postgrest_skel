<template>
  <v-footer
    id="core-footer"
    absolute
    height="82"
  >
    <div class="footer-items">
      <span
        v-for="link in links"
        :key="link.name"
      >
        <a
          :href="link.Link"
          class="tertiary--text footer-links">{{ link.name }}</a>
      </span>
    </div>
    <v-spacer/>
    <span class="font-weight-light copyright">
      &copy;
      {{ (new Date()).getFullYear() }}
      <a
        href="https://www.creative-tim.com/"
        target="_blank">Creative Tim</a>, made with <v-icon color="tertiary" size="17">mdi-heart</v-icon> for a better web; Ramode integration.
    </span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: [
      { name: 'GIT', Link: 'https://github.com/morfair/vue_postgrest_skel' },
      { name: 'VKontakte', Link: 'https://vk.com/morfair' },
    ]
  })
}
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
