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
});

function closeMobileMenu(selector, mobileMenuSelector) {
	selector.addEventListener('click', () => {
		mobileMenuSelector.close();
	});
}