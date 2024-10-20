<script setup>
definePageMeta({layout: 'common', auth: true,});
</script>
<template>
    <main class="flexible col" id="feed">
        <div class="mybiz-card card" style="display: flex; flex-direction: column; gap: 0.5em; width: 100%; padding: 10px;">
            <div style="display: flex; gap: 0.5em;">
                <div class="rounded" style="width: 90px; height: 90px; background-color: pink;"></div>
                <div style="display: flex; flex-direction: column; justify-content: space-evenly; width: calc(100% - 90px - 0.5em);">
                    <div class="bold h6">Emmadave Computer Technology Services</div>
                    <div class="faint-text-v1">
                        <span>@emmadavetechservices</span> | <span>Computer repair services</span>
                    </div>
                    <div class="flexbox flex-wrap semibold" style="gap: 1em;">
                        <span><SvgIcon name="comment" class="small" /> 3 Messages</span>
                        <span><SvgIcon name="groups" class="small" /> 3 Followers</span>
                    </div>
                </div>
            </div>
            <div class="fluid flexbox flex-wrap" style="gap: 0.5em;">
                <div class="col"><RouterLink to="/manage/overview" class="compact fluid button">Manage page</RouterLink></div>
                <div class="col"><button class="compact fluid button">Create post</button></div>
                <div class="col">
                    <Dropdown :options="{directionPriority: {x: 'left', y: 'bottom'}}" class="as-icon fluid compact button">
                        <SvgIcon name="more_horiz" />
                        <div class="drop menu">
                            <div class="item"><SvgIcon name="campaign" class="lead" /> Promote</div>
                            <div class="item"><SvgIcon name="share" class="lead" /> Share</div>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    </main>
</template>