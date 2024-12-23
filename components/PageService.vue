<template>
  <div class="page-serv">
    <div class="serv-pic"></div>
    <div class="serv-content">
      <div class="serv-title">Service title or name a max of 2 lines</div>
      <div class="serv-details">Service description in a small font size to fit a max of 2 lines or truncate.</div>
      <div class="serv-price">N3,000</div>
    </div>
  </div>
</template>

<style lang="scss">
  .page-serv {
    width: 32.5rem;
    position: relative;
    border-radius: var(--sm-radius);
    border: 1px solid transparent;
    line-height: 1.375;
    display: grid;
    grid-template-columns: 12.5rem 1fr;
    grid-template-rows: auto;
    align-content: center;
    gap: 0.5rem;

    &:hover {
      border-color: var(--outline);
    }
  }
  .serv-content {
    padding: 0.5rem;
  }
  .serv-pic {
    position: relative;
    border-radius: inherit;
    width: 100%;
    padding-top: calc(100% / 3 * 2);
    background-color: #F8D4D3;
  }
  .serv-price {
    font-size: 2rem;
    font-weight: bold;
  }
  .serv-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-size: calc(var(--lg-size) * 1rem);
    font-weight: var(--semibold-weight);
  }
  .serv-details {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-size: calc(var(--sm-size) * 1rem);
  }
</style>