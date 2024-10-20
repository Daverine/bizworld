<script>
    export default {
        name: 'rc-manage-shareables',
        props: ['name'],
        setup() {
            const
				mainStore = useMainStore(),
				userStore = useUserStore(),
                searchStore = useSearchStore()
			;

			return { mainStore, userStore, searchStore }
        }
    }
</script>
<template>
    <div v-if="name === 'nav_menu'" class="items" style="border-radius: var(--default-radius);">
        <RouterLink to="/myshops" class="item exit-sidepanel">
            <SvgIcon name="arrow_back" class="lead" />
            Go back to my shops
        </RouterLink>
        <RouterLink to="/manage/overview" exact-active-class="active" class="item exit-sidepanel">
            <SvgIcon name="layers" class="lead nview" />
            <SvgIcon name="layers_filled" class="lead aview" />
            Overview
        </RouterLink>
        <RouterLink to="/manage/posts" exact-active-class="active" class="item exit-sidepanel">
            <SvgIcon name="article" class="lead nview" />
            <SvgIcon name="article_filled" class="lead aview" />
            Posts
        </RouterLink>
        <RouterLink to="/manage/biz-info" exact-active-class="active" class="item exit-sidepanel">
            <SvgIcon name="contact_page" class="lead nview" />
            <SvgIcon name="contact_page_filled" class="lead aview" />
            Page Info
        </RouterLink>
        <RouterLink to="/manage/media" exact-active-class="active" class="item exit-sidepanel">
            <SvgIcon name="perm_media" class="lead nview" />
            <SvgIcon name="perm_media_filled" class="lead aview" />
            Media
        </RouterLink>
        <RouterLink to="/manage/products" exact-active-class="active" class="item exit-sidepanel">
            <SvgIcon name="shopping_bag" class="lead nview" />
            <SvgIcon name="shopping_bag_filled" class="lead aview" />
            Products
        </RouterLink>
        <RouterLink to="/manage/services" exact-active-class="active" class="item exit-sidepanel">
            <SvgIcon name="home_repair_service" class="lead nview" />
            <SvgIcon name="home_repair_service_filled" class="lead aview" />
            Services
        </RouterLink>
        <RouterLink to="/manage/design" exact-active-class="active" class="item exit-sidepanel">
            <SvgIcon name="dashboard" class="lead nview" />
            <SvgIcon name="dashboard_filled" class="lead aview" />
            Page Layout
        </RouterLink>
        <RouterLink to="/manage/support" exact-active-class="active" class="item exit-sidepanel">
            <SvgIcon name="contact_support" class="lead nview" />
            <SvgIcon name="contact_support_filled" class="lead aview" />
            Support
        </RouterLink>
    </div>
    <template v-else-if="name === 'page_nav'">
        <aside id="navmenu" class="flex-none col sidemenu md-and-down-hidden sp-wrapper">
            <div v-scrollPin="{ topSpacing: 84, bottomSpacing: 16, ancestorGuarded: true }" class="vertical transparent menu">
                <rc-manage-shareables name="nav_menu" />
            </div>
        </aside>
    </template>
    <header v-else-if="name === 'common_header'" id="main-header" style="border-bottom: 1px solid var(--outline); background-color: var(--surface);">
        <div class="menu" style="height: 64px;">
            <Shareables name="main_menu" />
        </div>
        <div class="container md-and-up-hidden" style="padding-top: 0.5rem; padding-bottom: 0.5rem;">
            <form class="fluid" @submit.prevent="searchStore.triggerSearch()">
                <label class="input fluid transparent" style="background-color: var(--surface-v4) !important;">
                    <SvgIcon name="search" class="xhover" />
                    <input v-model="searchStore.searchBox" type="search" id="searchinput" placeholder="Your search here." class="subject" ref="inputbox" autofocus />
                    <button type="button" v-tooltip.unblocking data-tooltip="Scan Business QR" class="icon open-modal" data-target="scanqr-modal">
                        <SvgIcon name="qr_code_scanner" />
                    </button>
                    <button type="button" v-tooltip.unblocking data-tooltip="Search location is set to Nigeria. Click to change it." class="icon open-modal" data-target="">
                        <SvgIcon name="location_on" />	
                    </button>
                </label>
            </form>
        </div>
	</header>
</template>
