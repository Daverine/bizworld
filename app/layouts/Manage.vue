<template>
    <div class="as-page">
        <ManageShareables name="common_header" />
        <section id="firstSec" ref="main" class="csection flexbox">
            <ManageShareables name="page_nav" />
            <slot />
            <!-- <Shareables name="ad_menu" /> -->
        </section>
    </div>
</template>