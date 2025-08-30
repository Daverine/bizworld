<template>
  <NuxtLink to="/myshops" class="item exit-sidepanel">
    <Icon name="material-symbols:arrow-back-rounded" class="lead" />
    Go back to my shops
  </NuxtLink>
  <NuxtLink
    :to="{ name: 'manage-biz-overview', params: { id: $route.params.id } }"
    exact-active-class="active"
    class="item exit-sidepanel ac-viewbox-ref"
  >
    <i class="icon ac-viewbox">
      <Icon name="material-symbols:layers-outline-rounded" />
      <Icon name="material-symbols:layers-rounded" />
    </i>
    Overview
  </NuxtLink>
  <NuxtLink
    :to="{ name: 'manage-biz-posts', params: { id: $route.params.id } }"
    exact-active-class="active"
    class="item exit-sidepanel ac-viewbox-ref"
  >
    <i class="icon ac-viewbox">
      <Icon name="material-symbols:article-outline-rounded" />
      <Icon name="material-symbols:article-rounded" />
    </i>
    Posts
  </NuxtLink>
  <NuxtLink
    :to="{ name: 'manage-biz-info', params: { id: $route.params.id } }"
    exact-active-class="active"
    class="item exit-sidepanel ac-viewbox-ref"
  >
    <i class="icon ac-viewbox">
      <Icon name="material-symbols:contact-page-outline-rounded" />
      <Icon name="material-symbols:contact-page-rounded" />
    </i>
    Page Info
  </NuxtLink>
  <NuxtLink
    :to="{ name: 'manage-biz-media', params: { id: $route.params.id } }"
    exact-active-class="active"
    class="item exit-sidepanel ac-viewbox-ref"
  >
    <i class="icon ac-viewbox">
      <Icon name="material-symbols:perm-media-outline-rounded" />
      <Icon name="material-symbols:perm-media-rounded" />
    </i>
    Media
  </NuxtLink>
  <NuxtLink
    :to="{ name: 'manage-biz-products', params: { id: $route.params.id } }"
    exact-active-class="active"
    class="item exit-sidepanel ac-viewbox-ref"
  >
    <i class="icon ac-viewbox">
      <Icon name="material-symbols:shopping-bag-outline" />
      <Icon name="material-symbols:shopping-bag" />
    </i>
    Products
  </NuxtLink>
  <NuxtLink
    :to="{ name: 'manage-biz-services', params: { id: $route.params.id } }"
    exact-active-class="active"
    class="item exit-sidepanel ac-viewbox-ref"
  >
    <i class="icon ac-viewbox">
      <Icon name="material-symbols:home-repair-service-outline-rounded" />
      <Icon name="material-symbols:home-repair-service-rounded" />
    </i>
    Services
  </NuxtLink>
  <NuxtLink
    :to="{ name: 'manage-biz-layout', params: { id: $route.params.id } }"
    exact-active-class="active"
    class="item exit-sidepanel ac-viewbox-ref"
  >
    <i class="icon ac-viewbox">
      <Icon name="material-symbols:design-services-outline-rounded" />
      <Icon name="material-symbols:design-services-rounded" />
    </i>
    Page Layout
  </NuxtLink>
  <NuxtLink
    :to="{ name: 'manage-biz-support', params: { id: $route.params.id } }"
    exact-active-class="active"
    class="item exit-sidepanel ac-viewbox-ref"
  >
    <i class="icon ac-viewbox">
      <Icon name="material-symbols:contact-support-outline-rounded" />
      <Icon name="material-symbols:contact-support-rounded" />
    </i>
    Support
  </NuxtLink>
</template>
