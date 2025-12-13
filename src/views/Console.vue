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
        <div>
          <button v-if="game.isPlayed" @click="unplayGame"></button>
          <a
            @click="gameClick"
            :href="`https://vimm.net/vault/${game.id}`"
            target="_blank"
          >
            <img :src="gameImage" :title="game.name" @load="gameImageLoaded" />
          </a>
        </div>
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
        isPlayed: false,
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
    },
  },
  watch: {
    'game.isPlayed'(newVal) {
      if (!this.game.id)
        return;

      const playedGameIds = new Set(window.localStorage.getItem('playedGameIds')?.split(',') ?? []);
      if (newVal)
        playedGameIds.add(this.game.id);
      else
        playedGameIds.delete(this.game.id);
      
      window.localStorage.setItem('playedGameIds', [...playedGameIds].join(','));
    },
  },
  mounted() {
    document.body.style.background = '#000';
  },
  methods: {
    async getGame(list) {
      let playedGameIds = window.localStorage.getItem('playedGameIds')?.split(',') ?? [];
      const params = { excludeIds: playedGameIds };
      const game = list
        ? (await axios.get(`${process.env.API_URL}/roms/${list}`, { params })).data
        : (await axios.get(`${process.env.API_URL}/roms`, { params })).data;
      
      playedGameIds = new Set(playedGameIds);
      game.isPlayed = playedGameIds.has(game.id);

      return game;
    },
    gameClick() {
      this.game.isPlayed = true;
    },
    unplayGame() {
      this.game.isPlayed = false;
    },
  },
};
</script>

<style lang="scss" scoped>
#container {
  & > button {
    color: #fff !important;
  }

  div.game > div {
    width: fit-content;
    margin: 0 auto;
    button {
      width: 100%;
      height: 1rem;
      display: block;
      background: green;
      border: 0;
    }
  }

  div.platform {
    position: absolute;
    right: 2rem;
    bottom: 1rem;

    a {
      &:hover img {
        filter: brightness(110%) drop-shadow(2px 4px 6px black);
      }

      img {
        width: 7rem;
        filter: brightness(95%) drop-shadow(2px 4px 6px black);
        transition: all 0.33s ease;
      }
    }
  }
}
</style>