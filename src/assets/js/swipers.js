import Swiper from 'swiper/bundle';
(function () {
	const productsSwiper = new Swiper(".productsSwiper", {
		speed: 1500,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});

	const thumbReviewsswiper = new Swiper(".thumbsReviewsSwiper", {
		slidesPerView: 'auto',
		freeMode: true,
		watchSlidesProgress: true,
	});

	const mainReviewsSwiper = new Swiper(".reviewsSwiper", {
		speed: 500,
		effect: "cards",
		thumbs: {
			swiper: thumbReviewsswiper,
		},
	});

	const mainSectionsSwiper = new Swiper(".mainSwiper", {
		speed: 1250,
		direction: "vertical",
		slidesPerView: 1,
		spaceBetween: 0,
		mousewheel: true,
		keyboard: {
			enabled: true,
		},
		pagination: {
			el: ".right-dotted",
			clickable: true,
		},
		hashNavigation: {
			watchState: true,
		}
	});

	themeDottedCurrentSlide(mainSectionsSwiper);

	mainSectionsSwiper.on('slideChange', (swiper) => {
		themeDottedCurrentSlide(swiper);
	});

	function themeDottedCurrentSlide(swiper) {
		const activeIndexSlide = swiper.activeIndex,
			activeSlide = swiper.slides[activeIndexSlide],
			themeSlide = activeSlide.getAttribute('data-section-theme'),
			pagination = document.querySelector('.right-dotted');

		if (themeSlide === 'dark') {
			pagination.classList.add('right-dotted-dark');
		} else {
			pagination.classList.remove('right-dotted-dark');
		}
	}

})();