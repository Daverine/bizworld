<template>
  <div class="page-prod">
    <div class="prod-pic"></div>
    <div class="prod-content">
      <div class="prod-price">N3,000</div>
      <div class="prod-title">Product title or name a max of 2 lines</div>
      <div class="prod-details">Product description in a small font size to fit a max of 2 lines or truncate.</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .page-prod {
    width: 12.5rem;
    position: relative;
    text-align: center;
    border-radius: var(--sm-radius);
    border: 1px solid transparent;
    line-height: 1.375;

    
    &:hover {
      border-color: var(--outline);
    }
  }
  .prod-content {
    margin-top: 0.5rem;
    padding: 0rem 1rem 1rem;
  }
  .prod-pic {
    position: relative;
    border-radius: inherit;
    width: 100%;
    padding-top: 100%;
    background-color: #F8D4D3;
  }
  .prod-price {
    font-size: 2rem;
    font-weight: bold;
  }
  .prod-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-weight: var(--semibold-weight);
  }
  .prod-details {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-size: calc(var(--sm-size) * 1rem);
  }
</style>