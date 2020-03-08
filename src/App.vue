<template>
  <div>
    <div id="container" v-cloak :class="{ loading }" :style="bgStyle" @click="goToNewUrl">
      <img ref="gameBackgroundImage" v-if="gameId" :src="gameBackgroundImage" />
      <img ref="gameImage" v-if="gameId" :src="gameImage" />
    </div>
    <div id="loader" :class="{ hidden: !loading && !switching }">
      <square-loader :loading="loading || switching" color="rgba( 62, 126, 167, 0.8)"></square-loader>
    </div>
  </div>
</template>

<script>
import SquareLoader from 'vue-spinner/src/SquareLoader.vue'
import axios from 'axios'

export default {
  components: {
    SquareLoader
  },
  data() {
    return {
      gameId: null,
      loading: true,
      switching: false,
      noLargeImage: false
    }
  },
  computed: {
    gameBackgroundImage() {
      return `https://steamcdn-a.akamaihd.net/steam/apps/${this.gameId}/page_bg_generated.jpg`
    },
    gameImage() {
      const imageName = this.noLargeImage ? 'header' : 'capsule_616x353'
      return `https://steamcdn-a.akamaihd.net/steam/apps/${this.gameId}/${imageName}.jpg`
    },
    bgStyle() {
      if (this.loading)
        return {}
      else
        return { backgroundImage: `url(${this.gameBackgroundImage})` }
    }
  },
  async created() {
    if (new RegExp(/random-game\/?$/).test(window.location.href))
      await this.goToNewUrl()
    else {
      let url = window.location.pathname
      if (url.endsWith('/'))
        url = url.slice(0, -1)

      this.gameId = url.split('/').reverse()[0]
    }
  },
  mounted() {
    let backgroundLoaded = false
    let imageLoaded = false

    const backgroundImageLoaded = () => {
      if (imageLoaded)
        this.loading = false
      else
        backgroundLoaded = true

      this.$refs.gameBackgroundImage.parentNode.removeChild(this.$refs.gameBackgroundImage)
    }

    this.$refs.gameBackgroundImage.addEventListener('load', backgroundImageLoaded)
    this.$refs.gameBackgroundImage.addEventListener('error', backgroundImageLoaded)

    this.$refs.gameImage.addEventListener('load', () => {
      if (backgroundLoaded)
        this.loading = false
      else
        imageLoaded = true
    })

    this.$refs.gameImage.addEventListener('error', async () => {
      if (this.noLargeImage)
        await this.goToNewUrl()

      this.noLargeImage = true
    })
  },
  methods: {
    async getGameId() {
      return (await axios.get(`${process.env.API_URL}/get-random-unplayed-game`)).data.gameId
    },
    async goToNewUrl() {
      this.switching = true
      window.location.href = `/random-game/${await this.getGameId()}`
    }
  }
}
</script>

<style lang="scss">
body {
  background: #000;

  [v-cloak],
  .loading {
    opacity: 0 !important;
    pointer-events: none;
  }

  #container,
  #loader {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition: opacity 500ms ease;
  }

  #container {
    width: 100vw;
    height: 100vh;
    font-family: "Motiva Sans", Sans-serif;
    font-weight: 300;
    font-size: 5vw;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    cursor: pointer;

    img {
      box-shadow: 5px 5px 14px 7px rgba(0, 0, 0, 0.7);
    }
  }

  #loader {
    position: fixed;
    z-index: 999;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);

    &.hidden {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>