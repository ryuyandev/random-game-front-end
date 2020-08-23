<template>
  <div>
    <div
      id="container"
      v-cloak
      v-if="game.id"
      :class="{ loading }"
      :style="bgStyle">
        <img ref="gameBackgroundImage" :src="gameBackgroundImage" />
        <button
          class="material-icons"
          :class="{ hidden: noPrevious }"
          @click="previous">
            keyboard_arrow_left
        </button>
        <div>
          <a :href="`steam://run/${game.id}`">
            <img ref="gameImage" :src="gameImage" :title="game.name" />
          </a>
        </div>
        <button class="material-icons" @click="next">keyboard_arrow_right</button>
    </div>
    <div id="loader" :class="{ hidden: !loading && !switching }">
      <square-loader :loading="loading || switching" color="rgba(62, 126, 167, 0.8)"></square-loader>
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
      list: 'all',
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
    },
    noPrevious() {
      return this.game.id == window.localStorage.startingId
    }
  },
  async created() {
    const urlParams = new URLSearchParams(window.location.search)
    const list = urlParams.get('list')

    if (list == 'unplayed' || list == 'played')
      this.list = list

    if (new RegExp(/random-game\/?$/).test(window.location.pathname))
      await this.goToNewUrl(true)
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
    async getGame(list) {
      return (await axios.get(`${process.env.API_URL}/${list}`)).data
    },
    async goToNewUrl(start) {
      this.switching = true

      const game = await this.getGame(this.list)

      if (start)
        window.localStorage.startingId = game.id

      window.localStorage['gameName' + game.id] = game.name
      window.location.href = `/random-game/${game.id}${window.location.search}`
    },
    previous() {
      window.history.back()
    },
    async next() {
      if (!window.history.forward())
        await this.goToNewUrl()
    }
  }
}
</script>

<style lang="scss">
body {
  background: url('./assets/img/default-bg.png') center top no-repeat #1b2838;
  overflow: hidden;
  user-select: none;

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
    font-size: 18px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    color: #fff;

    button {
      border: 0;
      padding: 0;
      outline: 0;
      font-size: 140px;
      background: transparent;
      color: rgba( 62, 126, 167, 0.8);
      text-shadow: 2px 0 7px #000;
      cursor: pointer;
      transition: all 250ms ease;
      position: relative;

      &.hidden {
        opacity: 0;
        pointer-events: none;
      }

      &:first-child {
        left: 0;
      }

      &:last-child {
        right: 0;
      }

      &:hover {
        color: rgb(71, 147, 194);

        &:first-child {
          left: -3px;
        }

        &:last-child {
          right: -3px;
        }
      }
    }

    div {
      flex-grow: 1;
      text-align: center;

      a {
        background: #000;
        display: inline-flex;
        outline: 0;

        &:hover img {
          opacity: 1;
          box-shadow: 7px 7px 14px 7px rgba(0, 0, 0, 0.6);
        }

        &:active img {
          opacity: 0.7;
          box-shadow: 5px 5px 14px 5px rgba(0, 0, 0, 0.7);
        }

        img {
          box-shadow: 5px 5px 14px 7px rgba(0, 0, 0, 0.7);
          opacity: 0.9;
          transition: all .33s ease;
        }
      }
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