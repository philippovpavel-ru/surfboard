document.addEventListener("DOMContentLoaded", () => {
	const mobileBurger = document.querySelector('.burger-btn'),
		mobileMenu = document.getElementById('mobile-menu'),
		mobileMenuItems = mobileMenu.querySelectorAll('.primary-menu__item'),
		mobileMenuClose = mobileMenu.querySelector('.mobile-menu__close ');

	mobileBurger.addEventListener('click', (e) => {
		e.preventDefault();

		mobileMenu.showModal();
	})

	mobileMenuItems.forEach(menuItem => {
			closeMobileMenu(menuItem, mobileMenu);
	});

	closeMobileMenu(mobileMenuClose, mobileMenu);

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

	const members = document.querySelectorAll('.member');
	membersShow(members);

	window.addEventListener('resize', (e) => {
		if (members.length < 1) return;

		if (document.documentElement.clientWidth <= 768) {
			members.forEach(member => {
				member.classList.remove('member-active');
				member.querySelector('.member__info').style.height = '';
			});
		}
	});

	maskPhone('[type="tel"]', '+7 ___ ___ ____');

	sendForm('.form-delivery');
	closeDialogResponseForm('.form-response__btn', 'form-response')
});

function membersShow(arrayMembers) {
	if (arrayMembers.length < 1) return;

	arrayMembers.forEach(member => {
		const switcherMember = member.querySelector('.member__switcher'),
			membersClone = Array.from(arrayMembers);

		switcherMember.addEventListener('click', (e) => {
			e.preventDefault();
			const parent = e.target.closest('.member');

			membersClone.forEach(el => {
				const infoMember = el.querySelector('.member__info');

				if (parent === el) {
					el.classList.toggle('member-active');
				} else {
					el.classList.remove('member-active');
				}

				if ( el.classList.contains('member-active') ) {
					infoMember.style.height = `${infoMember.scrollHeight}px`;
				} else {
					infoMember.style.height = '';
				}
			});

		});
	});
}

function closeMobileMenu(selector, mobileMenuSelector) {
	selector.addEventListener('click', () => {
		mobileMenuSelector.close();
	});
}

function maskPhone(selector, masked = '+7 (___) ___-__-__') {
	const elems = document.querySelectorAll(selector);

	function mask(event) {
		const keyCode = event.keyCode;
		const template = masked,
			def = template.replace(/\D/g, ""),
			val = this.value.replace(/\D/g, "");

		let i = 0,
			newValue = template.replace(/[_\d]/g, function (a) {
				return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
			});
		i = newValue.indexOf("_");
		if (i !== -1) {
			newValue = newValue.slice(0, i);
		}
		let reg = template.substr(0, this.value.length).replace(/_+/g,
			function (a) {
				return "\\d{1," + a.length + "}";
			}).replace(/[+()]/g, "\\$&");
		reg = new RegExp("^" + reg + "$");
		if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
			this.value = newValue;
		}
		if (event.type === "blur" && this.value.length < 5) {
			this.value = "";
		}

	}

	for (const elem of elems) {
		elem.addEventListener("input", mask);
		elem.addEventListener("focus", mask);
		elem.addEventListener("blur", mask);
	}
}

function sendForm(selector) {
	const form = document.querySelector(selector);
	if (form === null) return;

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		if (!isValidate(e.target)) return;

		const name = form.elements.name.value,
			phone = form.elements.phone.value,
			comment = form.elements.comment.value,
			to = form.elements.to.value,
			server = 'https://webdev-api.loftschool.com/sendmail';

		const data = {
			name: name,
			phone: phone,
			comment: comment,
			to: to
		};

		const xhr = new XMLHttpRequest();
		xhr.responseType = 'json';
		xhr.open('POST', server);
		xhr.setRequestHeader('content-type', 'application/json');
		xhr.send( JSON.stringify(data) );

		xhr.addEventListener('load', () => {
			const status = xhr.response.status,
				message = xhr.response.message,
				dialog = document.getElementById('form-response'),
				dialogText = dialog.querySelector('.form-response__text');

			dialogText.innerText = message;

			if (status === 0) {
				dialog.classList.add('form-response__invalid');
			} else {
				dialog.classList.remove('form-response__invalid');
			}

			dialog.showModal();
		});
	});
}

function isValidate(form) {
	let isValidate = true;

	const reqs = form.querySelectorAll('[required]');
	if (reqs.length < 1) return;

	reqs.forEach(req => {
		if (!req.value.trimStart()) {
			isValidate = false;

			req.classList.add('form-field__invalid');
		} else {
			req.classList.remove('form-field__invalid');
		}
	});

	return isValidate;
}

function closeDialogResponseForm(selectorClose, idDialog) {
	const close = document.querySelector(selectorClose),
		dialog = document.getElementById('form-response');

	if (close === null) return;
	
	close.addEventListener('click', (e) => {
		e.preventDefault();

		dialog.close();
	})
}