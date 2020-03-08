<template>
  <div>
    <div id="container" v-cloak :class="{ loading }" :style="bgStyle" @click="goToNewUrl">
      <img ref="gameBackgroundImage" v-if="game.id" :src="gameBackgroundImage" />
      <img ref="gameImage" v-if="game.id" :src="gameImage" />
      <span>{{ game.name }}</span>
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
      loading: true,
      switching: false,
      noLargeImage: false,
      game: {
        id: null,
        name: null
      }
    }
  },
  computed: {
    gameBackgroundImage() {
      return `https://steamcdn-a.akamaihd.net/steam/apps/${this.game.id}/page_bg_generated.jpg`
    },
    gameImage() {
      const imageName = this.noLargeImage ? 'header' : 'capsule_616x353'
      return `https://steamcdn-a.akamaihd.net/steam/apps/${this.game.id}/${imageName}.jpg`
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

      this.game.id = url.split('/').reverse()[0]
      this.game.name = window.localStorage['gameName' + this.game.id]
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
    async getGame() {
      return (await axios.get(`${process.env.API_URL}/get-random-unplayed-game`)).data
    },
    async goToNewUrl() {
      this.switching = true
      const game = await this.getGame()
      window.localStorage['gameName' + game.id] = game.name
      window.location.href = `/random-game/${game.id}`
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
    flex-direction: column;
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
    font-size: 18px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    color: #fff;
    cursor: pointer;

    img {
      box-shadow: 5px 5px 14px 7px rgba(0, 0, 0, 0.7);
      position: relative;
      top: 10px;
      z-index: 1;
      transition: top 500ms ease;

      &:hover {
        top: 0;

        & + span {
          top: 10px;
        }
      }
    }

    span {
      position: relative;
      top: -10px;
      transition: top 500ms ease;
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