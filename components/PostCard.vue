<script>
    export default {
        props: ['details'],
        data() {
            return {
                template: {
					cardId: 'post34885',
					cardType: 'post',
					date: 'May 28',
					title: '', // optional
					postText: 'Edtech on work. View profile. Just trying to test how it appears on saved route. It should look nice at least. Is it? Ko bad naa.',
					media: [{ type: 'image', source: '/images/ads.jpg', altTxt: 'pic' }],
					visibility: 132,
					thumbsUp: 0,
					comments: [],
					bizDetails: {
						name: 'Emmadave Computer Technology Services',
						url: 'https://www.edtech.com',
						place: {
							address: '3, Nepa road, beside Igbagboyemi Pharmacy,Isabo 111102',
							city: 'Abeokuta',
							state: 'Ogun state',
							map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6'
						},
						verify: true
					}
				}
            }
        }
    }
</script>
<template>
    <div class="itm-tag">
        <SvgIcon name="article" />
    </div>
    <div class="itm-display">
        <div class="itm-media">
            <canvas :style="`background-image: url(${details.media.filter(el => el.type === 'image')[0].source})`"></canvas>
        </div>
    </div>
    <div class="itm-content">
        <div class="link itm-title">{{ details.postText }}</div>
        <div class="itm-gap">
            <div class="truncate">
                <SvgIcon name="verified" v-if="details.bizDetails.verify" title="Verified" class="mini green-text r-spaced" />
                <a :href="details.bizDetails.url" target="_blank" :title="details.bizDetails.name" class="small faint-text-v1 semibold">{{ details.bizDetails.name }}</a>
            </div>
        </div>
        <!-- <div class="itm-gap">
            <span class="small semibold" style="color: var(--on-surface-variant);">Post</span>
        </div> -->
    </div>
</template>