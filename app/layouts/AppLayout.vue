<script>
    export default { name: "AppLayout" }
</script>
<template>
    <component :is="this.$route.meta.layoutComponent">
        <slot />
    </component>
</template>