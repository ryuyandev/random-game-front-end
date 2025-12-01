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
        <a :href="`https://vimm.net/vault/${game.id}`" target="_blank">
          <img :src="gameImage" :title="game.name" @load="gameImageLoaded" />
        </a>
      </div>
      <div class="platform">
        <router-link :to="`/console/${game.platform}`">
          <img :src="platformImage" :alt="game.platform" />
        </router-link>
      </div>
      <button class="material-icons" @click="next">keyboard_arrow_right</button>
    </div>
    <div id="loader" :class="{ hidden: !loading }">
      <square-loader :loading="loading" color="rgba(255, 255, 255, 0.8)" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import randomGamer from '../randomGamer';
import gb from '../assets/img/gb.png';
import gba from '../assets/img/gba.png';
import gbc from '../assets/img/gbc.png';
import genesis from '../assets/img/genesis.png';
import gg from '../assets/img/gg.png';
import n64 from '../assets/img/n64.png';
import nes from '../assets/img/nes.png';
import snes from '../assets/img/snes.png';

const platformImages = {
  gb,
  gba,
  gbc,
  genesis,
  gg,
  n64,
  nes,
  snes,
};

export default {
  mixins: [randomGamer],
  data() {
    return {
      pageName: 'console',
      game: {
        id: null,
        name: null,
        platform: null,
      },
    };
  },
  computed: {
    gameBackgroundImage() {
      return `${process.env.API_URL}/roms/image-proxy?url=${encodeURIComponent(`https://dl.vimm.net/image.php?type=screen&id=${this.game.id}`)}`;
    },
    gameImage() {
      return `${process.env.API_URL}/roms/image-proxy?url=${encodeURIComponent(`https://dl.vimm.net/image.php?type=box_large&id=${this.game.id}`)}`;
    },
    platformImage() {
      return platformImages[this.game.platform];
    }
  },
  methods: {
    async getGame(list) {
      return list
        ? (await axios.get(`${process.env.API_URL}/roms/${list}`)).data
        : (await axios.get(`${process.env.API_URL}/roms`)).data;
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  background: #000;

  #container {
    & > button {
      color: #fff !important;
    }

    div.platform {
      position: absolute;
      right: 2rem;
      bottom: 1rem;

      img {
        width: 7rem;
      }
    }
  }
}
</style>