<template>
  <div>
    <div
      id="container"
      v-cloak
      v-if="game.id"
      :class="{ loading }"
      :style="bgStyle"
    >
      <button
        class="material-icons"
        :class="{ hidden: noPrevious }"
        @click="previous"
      >
        keyboard_arrow_left
      </button>
      <img
        :src="gameBackgroundImage"
        @load="backgroundImageLoaded"
        @error="backgroundImageLoaded"
        style="display: none"
      />
      <div class="game">
        <a :href="`steam://run/${game.id}`">
          <img
            :src="gameImage"
            :title="game.name"
            @load="gameImageLoaded"
            @error="gameImageError"
          />
        </a>
      </div>
      <button class="material-icons" @click="next">keyboard_arrow_right</button>
    </div>
    <div id="loader" :class="{ hidden: !loading }">
      <square-loader :loading="loading" color="rgba(62, 126, 167, 0.8)" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import randomGamer from '../randomGamer';

export default {
  mixins: [randomGamer],
  data() {
    return {
      pageName: 'steam',
      noLargeImage: false,
    };
  },
  computed: {
    bgStyle() {
      if (this.loading) return {};
      else return { backgroundImage: `url(${this.gameBackgroundImage})` };
    },
    gameBackgroundImage() {
      return `https://steamcdn-a.akamaihd.net/steam/apps/${this.game.id}/page_bg_generated.jpg`;
    },
    gameImage() {
      const imageName = this.noLargeImage ? "header" : "capsule_616x353";
      return `https://steamcdn-a.akamaihd.net/steam/apps/${this.game.id}/${imageName}.jpg`;
    },
  },
  methods: {
    async getGame(list) {
      return (await axios.get(`${process.env.API_URL}/${list ?? 'all'}`)).data;
    },
    async gameImageError() {
      if (this.noLargeImage)
        await this.goToNewGame();

      this.noLargeImage = true;
    },
  },
};
</script>
