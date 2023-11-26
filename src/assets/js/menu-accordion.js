(function () {
	document.querySelectorAll(".menu-accordion__button").forEach(button => {
		button.addEventListener("click", function (e) {
			e.preventDefault();

			const item = this.closest(".menu-accordion__item");
			const itemOpened = item.classList.contains("active");
			const container = this.closest(".menu-accordion__list");

			if (itemOpened) {
				closeEveryItemInContainer(container);
			} else {
				closeEveryItemInContainer(container);
				openItem(item);
			}
		});
	});

	function measureWidth(item) {
		let reqItemWidth = 0;

		const screenWidth = window.innerWidth;
		const container = item.closest(".menu-accordion__list");
		const titlesBlocks = container.querySelectorAll(".menu-accordion__button");
		const titlesWidth = titlesBlocks[0].offsetWidth * titlesBlocks.length;

		const textContainer = item.querySelector(".menu-accordion__desc");
		const paddingLeft = parseInt(window.getComputedStyle(textContainer).paddingLeft);
		const paddingRight = parseInt(window.getComputedStyle(textContainer).paddingRight);

		const isMobile = window.matchMedia("(max-width: 786px)").matches;

		if (isMobile) {
			reqItemWidth = screenWidth - titlesWidth;
		} else {
			reqItemWidth = 500;
		}

		return {
			container: reqItemWidth,
			textContainer: reqItemWidth - paddingRight - paddingLeft
		};
	}

	function closeEveryItemInContainer(container) {
		const items = container.querySelectorAll(".menu-accordion__item");
		const content = container.querySelectorAll(".menu-accordion__content");

		items.forEach(item => item.classList.remove("active"));
		content.forEach(item => item.style.width = "0");
	}

	function openItem(item) {
		const hiddenContent = item.querySelector(".menu-accordion__content");
		const reqWidth = measureWidth(item);
		const textBlock = item.querySelector(".menu-accordion__desc");

		item.classList.add("active");
		hiddenContent.style.width = reqWidth.container + "px";
		textBlock.style.width = reqWidth.textContainer + "px";
	}
})();