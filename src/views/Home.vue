<template>
  <div id="container">
    <nav>
      <router-link to="/steam">Steam</router-link>
      <router-link to="/console">Console</router-link>
    </nav>
  </div>
</template>

<style lang="scss">
  nav a {
    width: 180px;
    display: inline-block;
    padding: 1rem 2rem;
    margin-right: 2rem;
    border-radius: 4px;
    background: #fff;
    color: #000;
    font-weight: bold;
    text-decoration: none;
    font-size: 3rem;
    text-align: center;
    transition: transform .2s ease;

    &:hover {
      transform: translateY(5px);
    }
  }
</style>