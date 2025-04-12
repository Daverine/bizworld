<script setup>
definePageMeta({layout: 'manage', auth: true, });
</script>
<template>
    <main class="flexible col" id="feed">

        <header class="sp-wrapper fluid z-level-3 p-h" style="margin-bottom: 1rem;">
            <div v-scrollPin="{ top: 64, independent: true }" style="background-color: var(--surface);">
                <div class="fluid l-aligned">
                    <div class="p-h3 h3">Overview</div>
                    <hr class="0-b-margined" />
                </div>
            </div>
        </header>
        <section class="bizmsec">
            <div class="heading small">Progress summary</div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <div
                    style="background-color: var(--surface-v3); padding: 0.75em; display: flex; flex-flow: column nowrap; align-items: center; border-radius: var(--default-radius);">
                    <header>
                        <SvgIcon name="person_filled" class="mini" />
                        Max Visitors
                        <SvgIcon name="info" class="mini" />
                    </header>
                    <div class="h2 content">
                        1024
                    </div>
                </div>
                <div
                    style="background-color: var(--surface-v3); padding: 0.75em; display: flex; flex-flow: column nowrap; align-items: center; border-radius: var(--default-radius);">
                    <header>
                        <SvgIcon name="groups_filled" class="mini" />
                        Post Engagement
                        <SvgIcon name="info" class="mini" />
                    </header>
                    <div class="h2 content">
                        200
                    </div>
                </div>
                <div
                    style="background-color: var(--surface-v3); padding: 0.75em; display: flex; flex-flow: column nowrap; align-items: center; border-radius: var(--default-radius);">
                    <header>
                        <SvgIcon name="reviews" class="mini" />
                        Page Reviews
                        <SvgIcon name="info" class="mini" />
                    </header>
                    <div class="h2 content">
                        20
                    </div>
                </div>
            </div>
        </section class="bizmsec">
        <section class="bizmsec">
            <div class="heading small">Earned barge</div>
            <div style="display: flex; gap: 1.5rem; align-items: center; justify-content: center; margin-bottom: 1rem;">
                <div class="text-center">
                    <Badges name="verified" style="font-size: 4rem;" />
                    <div class="semibold">Verified</div>
                </div>
                <div class="text-center">
                    <Badges name="escrow" style="font-size: 4rem;" />
                    <div class="semibold">Trade Assurance</div>
                </div>
                <div class="text-center">
                    <Badges name="5years" style="font-size: 4rem;" />
                    <div class="semibold">Sustainable</div>
                </div>
            </div>
            <div class="text-center">
                <div class="b-margined-sm">Learn more about what each of our badges mean and how to earn them.</div>
                <button class="button">Learn more</button>
            </div>
        </section>
        <section class="bizmsec">
            <div class="heading small">Your market plan</div>
            <div class="primary note">
                <div class="content">
                    <div class="small heading">Basic</div>
                    <div style="display: flex; gap: 1rem;">
                        <div class="text-center" style="flex: 0 0 auto;">
                            <div class="h1">$2</div>
                            <div class="small">per month</div>
                        </div>
                        <div>
                            <p>Bizworld basic plan enable you to create a maximum of one microsite on our platform and
                                also enables you to post a maximum of 10 products and services.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center">
                <div class="b-margined-sm">See all our available market plan.</div>
                <button class="button open-modal" data-target="marketplan">Market plans</button>
            </div>
        </section>
        <Modal id="marketplan">
            <div class="dialog self-scroll padded">
                <div class="note">
                    <div class="content">
                        <div class="small heading">Standard</div>
                        <div style="display: flex; gap: 1rem;">
                            <div class="text-center" style="flex: 0 0 auto;">
                                <div class="h1">$5</div>
                                <div class="small">per month</div>
                            </div>
                            <div>
                                <p>Bizworld free plan enable you to create a maximum of one microsite for free on
                                    our platform and also enables you to post a maximum of 10 products and services.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="note">
                    <div class="content">
                        <div class="small heading">Premium</div>
                        <div style="display: flex; gap: 1rem;">
                            <div><span class="h1">$0</span></div>
                            <div>
                                <p>Bizworld free plan enable you to create a maximum of one microsite free of charge
                                    on our platform and also enables you to post a maximum of 50 products and
                                    services. This offer will do for small business.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
        <section class="bizmsec">
            <div class="heading small">Business tools</div>
            <div class="grid menu 2-cols app-items rounded">
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
        </section>
    </main>
</template>

<style lang="scss">
.bizmsec {
    margin-bottom: 1.5rem;
}
</style>