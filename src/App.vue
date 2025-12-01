<template>
  <div>
    <router-view />
  </div>
</template>

<style lang="scss">
body {
  background: url("./assets/img/default-bg.png") center top no-repeat #1b2838;
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
      color: rgba(62, 126, 167, 0.8);
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
          left: -5px;
        }

        &:last-child {
          right: -5px;
        }
      }
    }

    div.game {
      flex-grow: 1;
      text-align: center;

      a {
        background: #000;
        display: inline-flex;
        outline: 0;

        &:hover img {
          filter: brightness(105%);
          box-shadow: 7px 7px 14px 7px rgba(0, 0, 0, 0.6);
        }

        &:active img {
          filter: brightness(80%);
          box-shadow: 5px 5px 14px 5px rgba(0, 0, 0, 0.7);
        }

        img {
          filter: brightness(95%);
          box-shadow: 5px 5px 14px 7px rgba(0, 0, 0, 0.7);
          transition: all 0.33s ease;
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