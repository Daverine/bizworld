<script>
export default {
    props: ['details'],
    data() {
        return {
            template: {
                cardId: 'prod39884',
                cardType: 'product',
                title: 'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
                media: [{ type: 'image', source: '/images/product.jpeg', alt: 'pic' }],
                labels: ['used', '15.6'],
                price: 'N100,000',
                currency: 'Naira',
                negotiable: true,
                rating: { rate: 3.5, raters: 340 },
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
            },
        }
    }
}
</script>
<template>
    <div class="itm-tag">
        <SvgIcon name="shopping_bag" />
    </div>
    <div class="itm-display">
        <div class="itm-media">
            <canvas
                :style="`background-image: url(${details.media.find(el => el.type === 'image')?.source})`"></canvas>
        </div>
    </div>
    <div class="itm-content">
        <div class="link itm-title" :title="details.title">{{ details.title }}</div>
        <div class="itm-gap">
            <div style="display: flex; gap: 0.5em; align-items: center;">
                <span class="h5 bold 0-margined" style="color: var(--primary);">{{ details.price }}&nbsp;</span>
                <SvgIcon name="handshake" class="small" v-if="details.negotiable" title="Negotiable" />
            </div>
            <div v-if="details.labels" class="labels" style="display: flex; gap: 0.5em;">
                <span v-for="label in details.labels" class="label">{{ label }}</span>
            </div>
        </div>
        <div class="itm-gap">

            <!-- <span class="small semibold" style="color: var(--on-surface-variant);">Product</span> -->
            <span v-if="details.rating" class="mini semibold" title="Average Rate (Number of raters)">
                <i class="icon yellow-text r-spaced">
                    <SvgIcon v-for="i in Math.floor(details.rating.rate)" name="star_filled" />
                    <SvgIcon v-if="details.rating.rate - Math.floor(details.rating.rate) >= 0.5" name="star_half" />
                    <SvgIcon v-for="i in (5 - Math.round(details.rating.rate))" name="star" />
                </i>
                <span>({{ `Rated ${details.rating.rate} in ${details.rating.raters} reviews` }})</span>
            </span>
        </div>
        <div class="itm-gap">
            <div class="truncate">
                <SvgIcon name="verified" v-if="details.bizDetails.verify" title="Verified"
                    class="r-spaced mini green-text" />
                <a :href="details.bizDetails.url" target="_blank" :title="details.bizDetails.name"
                    class="small faint-text-v1 semibold">{{ details.bizDetails.name }}</a>
            </div>
            <span :title="details.bizDetails.place.address" class="truncate" style="color: var(--on-surface-variant);">
                <SvgIcon name="location_on" class="mini r-spaced" />
                <span class="small semibold">{{ `${details.bizDetails.place.city}, ${details.bizDetails.place.state}`
                    }}</span>
            </span>
        </div>
    </div>
</template>