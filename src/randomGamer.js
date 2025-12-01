import SquareLoader from "vue-spinner/src/SquareLoader.vue";

export default {
  components: {
    SquareLoader,
  },
  data() {
    return {
      loading: true,
      backgroundLoaded: false,
      imageLoaded: false,
      backAmount: 0,
      game: {
        id: null,
        name: null,
      },
    };
  },
  computed: {
    noPrevious() {
      return this.game.id == window.localStorage.startingId;
    },
  },
  watch: {
    async '$route.params.gameId'(newVal) {
      await this.loadGame(newVal);
    },
  },
  async mounted() {
    await this.loadGame(this.$route.params.gameId);
  },
  methods: {
    async loadGame(gameId) {
      if (!gameId || Number.isNaN(Number(gameId)))
        await this.goToNewGame(true);
      else {
        this.game = JSON.parse(window.localStorage[`${this.pageName}/${gameId}`]);
      }
    },
    async goToNewGame(start) {
      this.loading = true;
      let list;
      if (this.$route.params.list)
        list = this.$route.params.list;
      // due to routes being shared, gameId can be the list
      else if (this.$route.params.gameId && Number.isNaN(Number(this.$route.params.gameId)))
        list = this.$route.params.gameId;

      const game = await this.getGame(list);
      if (game) {
        if (start)
          window.localStorage.startingId = game.id;
  
        window.localStorage[`${this.pageName}/${game.id}`] = JSON.stringify(game);
  
        if (list)
          this.$router.push({ name: `${this.pageName}-list-game`, params: { list, gameId: game.id } });
        else
          this.$router.push({ name: `${this.pageName}-game`, params: { gameId: game.id } });
      }
    },
    backgroundImageLoaded () {
      this.backgroundLoaded = true;

      if (this.imageLoaded)
        setTimeout(() => { this.loading = false }, 250);
    },
    gameImageLoaded() {
      this.imageLoaded = true;

      if (this.backgroundLoaded)
        setTimeout(() => { this.loading = false }, 250);
    },
    previous() {
      this.backAmount++;
      window.history.back();
    },
    async next() {
      if (this.backAmount > 0) {
        this.backAmount--;
        window.history.forward();
      } else {
        await this.goToNewGame();
      }
    },
  },
};
