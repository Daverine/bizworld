<script>
    export default {
        props: ['details'],
        data() {
            return {
                template: {
                    "bizName": "Emmadave Computer Technology Services",
                    "bizLogo": "/images/logo-sq.png",
                    "bizUrl": "https://www.edtech.com",
                    "bizCategory": "Computer repair services",
                    "location": {
                        "address": "3 Nepal road, beside Igbagboyemi Pharmacy, Isabo 111102",
                        "city": "Abeokuta",
                        "state": "Ogun State",
                        "url": "https://goo.gl/maps/y9ExQLSq37FL6EHm6"
                    },
                    "verified": true,
                    "date": "3 days ago",
                    "rating": 4,
                    "comment": "I know him as a computer engineer. And I have no reason to doubt his authenticity. But let see how it goes"
                }
            }
        }
    }
</script>
<template>
    <article class="review-card">
        <header style="display: flex; gap: 10px;">
			<div style="position: relative; height: max-content; line-height: 1;">
				<img class="avatar image" :src="details.bizLogo" />
                <SvgIcon v-if="details.verified" name="verified_sp" class="small" style="position: absolute; bottom: 0px; right: 0px;" />
			</div>
			<div style="flex: 1 1 auto;">
				<div class="fcd-displayname">{{ details.bizName }}</div>
				<div class="faint-text fcd-bizcategory"> {{ details.bizCategory }}</div>
			</div>
			<div>
				<Dropdown :options="{directionPriority: {x: 'left', y: 'bottom'}}">
					<SvgIcon name="more_horiz" />
					<div class="drop menu">
						<div class="item">Edit review</div>
						<div class="item">Delete review</div>
					</div>
				</Dropdown>
			</div>
        </header>
        <section style="display: flex; gap: 10px;">
            <div class="rating small yellow-text">
                <SvgIcon v-for="i in Math.floor(details.rating)" name="star_filled" />
                <SvgIcon v-if="details.rating - Math.floor(details.rating) >= 0.5" name="star_half" />
                <SvgIcon v-for="i in (5 - Math.round(details.rating))" name="star" />
            </div>
            <div><SvgIcon name="schedule" class="mini" /> {{ details.date }}</div>
        </section>
        <section>{{ details.comment }}</section>
    </article>
</template>
<style>
    .review-card {
        display: block;
        position: relative;
        padding: 1rem;
    }
</style>