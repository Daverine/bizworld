<template>
    <div class="as-page">
        <Shareables name="common_header" />
		<section id="firstSec" ref="main" class="csection flexbox">
			<Shareables name="page_nav" />
            <slot />
            <Shareables name="ad_menu" />
        </section>
    </div>
</template>