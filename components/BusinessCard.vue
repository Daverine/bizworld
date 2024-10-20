<script>
    export default {
        props: ['details'],
        data() {
            return {
                template: {
					cardId: 'biz003884',
					cardType: 'business',
					url: 'https://www.edtech.com',
					logo: '/images/logo-sq.png',
					name: 'Emmadave Computer Techonology Services',
					category: 'Computer repair services',
					place: {
						address: '3, Nepa road, beside Igbagboyemi Pharmacy,Isabo 111102',
						city: 'Abeokuta',
						state: 'Ogun state',
						map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6'
					},
					verify: true,
					rating: { rate: 3.5, raters: 30 },
					hours: [
						/*	
							time is in 24hr format
							-1 means did not open at all
						*/
						[-1],
						[8, 18],
						[8, 18],
						[15, 18],
						[8, 18],
						[-1],
						[8, 21]
					]

				},
            }
        },
        methods: {
			nextOpenDay(hours) {
				let ex = new Date().getDay() === 6 ? 0 : new Date().getDay() + 1, i = 1, result;
				for (; i < 6; i++) {
					if (hours[ex > 5 ? -1 + i : ex + i][0] > -1) {
						result = ex > 5 ? -1 + i : ex + i;
						break;
					}
				}
				return result;
			},
			whatDay(index) {
				return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index];
			}
		},
    } 
</script>
<template>
    <div class="itm-tag">
        <SvgIcon name="store" />
    </div>
    <div class="itm-display">
        <img :src="details.logo" :alt="`Business Logo for ${details.name}`" class="image" />
        <SvgIcon v-if="details.verify" name="verified_sp" title="Business verified" class="small green-text" style="position: absolute; bottom: 0px; right: 0px;" />
    </div>
    <div class="itm-content">
        <div class="link itm-title">{{ details.name }}</div>
        <div class="itm-gap">
            <span class="small semibold">{{ details.category }}</span>
            <span :title="details.place.address" class="truncate" style="color: var(--on-surface-variant);">
                <SvgIcon name="location_on" class="mini r-spaced" />
                <span class="small semibold">{{ `${details.place.city }, ${details.place.state}` }}</span>
            </span>
        </div>
        <div class="semibold itm-gap">
            <span v-if="details.rating" class="mini semibold" title="Average Rate (Number of raters)">
                <i class="icon yellow-text r-spaced">
                    <SvgIcon v-for="i in Math.floor(details.rating.rate)" name="star_filled" />
                    <SvgIcon v-if="details.rating.rate - Math.floor(details.rating.rate) >= 0.5" name="star_half" />
                    <SvgIcon v-for="i in (5 - Math.round(details.rating.rate))" name="star" />
                </i>
                <span>({{ `Rated ${details.rating.rate} in ${details.rating.raters} reviews` }})</span>
            </span>
            <span :title="details.hours[new Date().getDay()][0] < 0 ? 'Did not open today at all.' : `Open today by ${details.hours[new Date().getDay()][0]}:00 and closes by ${details.hours[new Date().getDay()][1]}:00.`">
                <SvgIcon name="today" class="mini r-spaced" />
                <span class="small">
                    <template v-if="details.hours[new Date().getDay()][0] < 0 || details.hours[new Date().getDay()][0] > new Date().getHours() || details.hours[new Date().getDay()][1] <= new Date().getHours()">
                        <span class="error-text">Closed.</span>
                        <span v-if="details.hours[new Date().getDay()][0] > new Date().getHours()">Opens {{ details.hours[new Date().getDay()][0] }}</span>
                        <span else>
                            Opens
                            {{
                                details.hours[new Date().getDay() === 6 ? 0 : new Date().getDay() + 1][0] > -1
                                    ? `${details.hours[new Date().getDay() === 6 ? 0 : new Date().getDay() + 1][0]}:00 Tomorrow`
                                    : `${details.hours[nextOpenDay(details.hours)][0]} on ${whatDay(nextOpenDay(details.hours))}`
                            }}</span>
                    </template>
                    <template v-else>
                        <span v-if="details.hours[new Date().getDay()][1] - new Date().getHours() < 2" class="warning-text">Closes soon. </span>
                        <span v-else class="success-text">Open. </span>
                        <span>Closes {{ `${details.hours[new Date().getDay()][1]}:00` }}</span>
                    </template>
                </span>
            </span>
        </div>
        <!-- <div class="itm-gap">
            <span class="compact mini label">Business</span>
        </div> -->
    </div>
</template>