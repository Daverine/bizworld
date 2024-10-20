<script setup>
const searchStore = useSearchStore();
const userStore = useUserStore();
</script>

<template>
	<header id="main-header">
		<div class="transparent menu" style="height: 64px">
			<div class="container items" style="border-radius: var(--default-radius)">
				<div class="item as-icon open-sidepanel" v-tooltip.unblocking data-tooltip="Menu"
					data-target="msidepanel">
					<SvgIcon name="menu" />
				</div>
				<div class="items md-and-down-hidden">
					<router-link to="/help#shop-online" class="item">Have a shop online</router-link>
					<Dropdown class="item">
						Support
						<SvgIcon name="expand_more" class="trailing" />
						<div class="drop menu">
							<Shareables name="supports" />
						</div>
					</Dropdown>
				</div>
				<div class="items r-aligned">
					<Shareables name="do_more_item" />
					<template v-if="userStore.auth">
						<div class="as-icon item" v-tooltip.unblocking data-tooltip="Notifications">
							<SvgIcon name="notifications" />
						</div>
						<Dropdown data-browse-dm="dm1_profile"
							:options="{ directionPriority: { x: 'left', y: 'bottom' } }" v-tooltip.unblocking
							data-tooltip="Your profile" class="xhover browse as-icon item">
							<img :src="userStore.userData.profileImg" alt="profile" class="fully-rounded logo" />
						</Dropdown>
						<Shareables id="dm1_profile" name="profile_menu" />
					</template>
					<template v-else>
						<div class="items sm-and-down-hidden">
							<div class="item open-modal" data-target="login-modal">
								Log in
							</div>
							<div class="xhover item 0-h-padding">
								<button class="primary button open-modal" data-target="register-modal">
									Sign Up
								</button>
							</div>
						</div>
						<Dropdown class="as-icon item sm-and-up-hidden">
							<SvgIcon name="person_add" class="lead" /> Account
							<div class="drop menu">
								<div class="item open-modal" data-target="login-modal">
									Log in
								</div>
								<div class="xhover item">
									<button class="primary button open-modal" data-target="register-modal">
										Sign Up
									</button>
								</div>
							</div>
						</Dropdown>
					</template>
				</div>
			</div>
		</div>
		<form id="searchbox" class="centered" @submit.prevent="searchStore.triggerSearch()">
			<div style="margin-bottom: 16px">
				<img src="/images/logo_full.png" alt="site logo" class="site-logo fluid image"
					style="max-width: 450px; background-color: rgba(128, 128, 128, 0.025)" />
				<p class="huge" style="margin-top: 0px">
					Search for business names, products and services.
				</p>
			</div>
			<div>
				<label class="input big fluid">
					<SvgIcon name="search" class="xhover" />
					<input v-model="searchStore.searchBox" type="search" id="searchinput"
						placeholder="Your search here." class="subject" ref="inputbox" autofocus />
					<button type="button" v-tooltip.unblocking data-tooltip="Scan QR" class="icon open-modal"
						data-target="scanqr-modal">
						<SvgIcon name="qr_code_scanner" />
					</button>
				</label>
				<div style="margin-top: 8px">
					Search in: <span class="bold">Nigeria</span>.
					<a href="#">Change Location</a>
				</div>
				<div class="flexbox equal-cols" style="gap: 16px; margin: 32px auto 0px; max-width: 300px">
					<div class="col">
						<button class="fluid button">SEARCH</button>
					</div>
					<div class="col">
						<button type="button" class="fluid button open-modal" data-target="explore-modal">
							EXPLORE
						</button>
					</div>
				</div>
			</div>
		</form>
		<div style="width: 100%; align-self: flex-end; margin: 2rem auto 1rem">
			<div role="button" @click="
				$refs.main.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
					inline: 'nearest',
				})
				" class="mouse_scroll">
				<div class="mouse">
					<div class="wheel"></div>
				</div>
				<div>
					<span class="m_scroll_arrows unu"></span>
					<span class="m_scroll_arrows doi"></span>
					<span class="m_scroll_arrows trei"></span>
				</div>
			</div>
		</div>
	</header>
	<article id="firstSec" ref="main">
		<section id="whatfor" class="sec-block">
			<div class="big centered container-text">
				<h1>
					Do <span class="primary-text">business</span> at your
					<span class="primary-text">conveniency</span>
				</h1>
				<p>
					Perceive Bizworld as a massive online marketplace where you meet a
					variety of businesses and careers showcasing themselves.
				</p>
				<p>
					You can get updates from stores, offices, and businesses in general.
					You can rate and write reviews on enterprises.
				</p>
				<div v-if="!userStore.auth" class="centered">
					<button class="primary button open-modal" data-target="register-modal">
						SIGN UP
					</button>
				</div>
			</div>
		</section>
		<section class="sec-block">
			<div class="container grid 1-cols md-2-cols">
				<div class="col">
					<img src="/images/explore.jpg" alt="picture depicting explore" class="image" />
				</div>
				<div class="col container-text big">
					<div>
						<h2><span class="primary-text">Explore</span> businesses around you without leaving <span class="primary-text">your spot</span></h2>
						<p>
							You can browse for businesses based on listed categories of
							commonly needed products and services. You can compare enterprises
							and determine where you should get things done.
						</p>
						<ul>
							<li>Find the category of service or shopping you need</li>
							<li>Compare distance, ratings and reviews of businesses</li>
							<li>View business info like location, what they offer, etc.</li>
							<li>Navigate to a business page to interact with the business</li>
							<li>
								Rate and write a review on a business based on your experience
							</li>
							<!-- Browse for products and services around you and know where to get things done without having to ask anyone. Our explore section displays businesses in categories of what they offer. So you can easily compare businesses there. If the category you are looking for is not there you can make use of seach instead.</li> -->
						</ul>
						<p>
							If you can not find the category of interest on our explore page,
							use the search feature instead.
						</p>
						<div class="centered">
							<button class="primary button open-modal" data-target="explore-modal">
								EXPLORE
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="sec-block">
			<div class="container grid 1-cols md-2-cols" style="flex-flow: row-reverse wrap">
				<div class="col">
					<img src="/images/qr.jpg" alt="picture depicting qr" class="image" />
				</div>
				<div class="col container-text big">
					<div>
						<h2><span class="primary-text">Know</span> their products and services <span class="primary-text">without asking</span></h2>
						<p>
							<strong>BizWorld QR codes</strong> are a convenient way to access
							information about businesses. These QR codes are often placed in
							public areas to make it easy for people to access a business’s
							page. You can use the QR code scanner on this page for such codes.
						</p>
						<!-- <p>Scan a business bizWorld QR Code and get to know what products or services a business offer. Businesses that have page(s) on bizWorld usually have their BizWorld QR Code pasted in public places to help people easyly access their page. You can utilize the QR scanner on this page on such Code and directly access a business page and explore their business world.</p> -->
						<div class="centered">
							<button class="primary button open-modal" data-target="scanqr-modal">
								SCAN QR
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="sec-block">
			<div class="big centered container-text">
				<h2>Take <span class="primary-text">your business online</span> with ease</h2>
				<p>
					Are you a business owner? Do you want people to connect with your
					business with ease online? We have you covered. Click on the Get
					Started button below to create your microsite here on BizWorld today
					and get connected with new clients and customers.
				</p>
				<div class="centered">
					<button class="primary button">GET STARTED</button>
				</div>
			</div>
		</section>
	</article>
	<footer style="background-color: rgba(128, 128, 128, 0.1)">
		<div class="container flexbox flex-wrap" style="gap: 1rem; padding: 2.75rem 1.25rem 1.25rem">
			<div class="col">
				<div class="heading">
					<img src="/images/logo.png" style="max-height: 1.25em" />
				</div>
				<div class="vertical text menu">
					<div class="item open-modal" data-target="search-modal">
						Business search
					</div>
					<div class="item open-modal" data-target="scanqr-modal">
						Scan QR code
					</div>
					<div class="item open-modal" data-target="explore-modal">
						Explore categories
					</div>
					<a href="#" class="item">Bring your business online</a>
					<a href="#" class="item">Showcase yourself</a>
				</div>
			</div>
			<div class="col">
				<div class="heading">Resources</div>
				<div class="vertical text menu">
					<a href="#" class="item">Help center</a>
					<a href="#" class="item">Blog</a>
					<a href="#" class="item">What’s a micro-site</a>
					<a href="#" class="item">About Us</a>
				</div>
			</div>
			<!-- <div class="col">
				<div class="heading">Business</div>
				<div class="vertical text menu">
					<a href="#" class="item">BizWorld</a>
					<a href="#" class="item">Linda - POS</a>
					<a href="#" class="item">School Management System</a>
				</div>
			</div> -->
			<div class="col">
				<div class="heading">Contacts</div>
				<div class="vertical text menu">
					<a href="#" class="item">+234000000000</a>
					<a href="#" class="item">info@bizworld.com</a>
					<a href="#" class="item">support@bizworld.com</a>
				</div>
				<button class="secondary compact button">Anonymous Feedback</button>
			</div>
			<div class="col">
				<div class="heading">Follow us</div>
				<div class="vertical text menu">
					<a href="#" class="item">LinkedIn</a>
					<a href="#" class="item">YouTube</a>
					<a href="#" class="item">Instagram</a>
					<a href="#" class="item">Facebook</a>
				</div>
			</div>
		</div>
		<div class="wrappable text menu" style="padding: 10px 0px">
			<div class="container items">
				<div class="item">Terms of use</div>
				<div class="item">About us</div>
				<div class="item">Help</div>
				<div class="item">Settings</div>
				<div class="items r-aligned">
					<div class="item">@ Copyright 2023</div>
					<div class="item">Emmadave Inc.</div>
				</div>
			</div>
		</div>
	</footer>
</template>

<style scoped>
#main-header {
	min-height: calc(100vh - 64px);
	display: flex;
	flex-wrap: wrap;
}

#searchbox {
	width: 100%;
	max-width: 600px;
	padding: 0px 1rem;
	margin: 32px auto;
	align-self: center;
}

.sec-block {
	padding-top: 75px;
	padding-bottom: 75px;
}

.sec-block .col {
	display: flex;
	flex-flow: row wrap;
	align-items: center;
	padding-left: 20px;
	padding-right: 20px;
}

.mouse_scroll {
	display: block;
	width: 24px;
	margin: auto;
}

.m_scroll_arrows {
	display: block;
	width: 5px;
	height: 5px;
	transform: rotate(45deg);

	border-right: 2px solid var(--on-surface);
	border-bottom: 2px solid var(--on-surface);
	margin: 0 0 3px 4px;

	width: 16px;
	height: 16px;
}

.unu {
	margin-top: 1px;
}

.unu,
.doi,
.trei {
	animation: mouse-scroll 1s infinite;
}

.unu {
	animation-direction: alternate;
	animation-delay: alternate;
}

.doi {
	animation-delay: 0.2s;
	animation-direction: alternate;
	margin-top: -6px;
}

.trei {
	animation-delay: 0.3s;
	animation-direction: alternate;
	margin-top: -6px;
}

.mouse {
	height: 42px;
	width: 24px;
	border-radius: 14px;
	transform: none;
	border: 2px solid var(--on-surface);
	top: 170px;
}

.wheel {
	height: 5px;
	width: 2px;
	display: block;
	margin: 5px auto;
	background-color: var(--on-surface);
	position: relative;
	height: 4px;
	width: 4px;
	border: 2px solid var(--on-surface);
	border-radius: 8px;
}

.wheel {
	animation: mouse-wheel 0.6s linear infinite;
}

@keyframes mouse-wheel {
	0% {
		top: 1px;
	}

	25% {
		top: 2px;
	}

	50% {
		top: 3px;
	}

	75% {
		top: 2px;
	}

	100% {
		top: 1px;
	}
}

@keyframes mouse-scroll {
	0% {
		opacity: 0;
	}

	50% {
		opacity: 0.5;
	}

	100% {
		opacity: 1;
	}
}
</style>
