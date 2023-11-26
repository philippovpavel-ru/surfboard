(function () {
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

					if (el.classList.contains('member-active')) {
						infoMember.style.height = `${infoMember.scrollHeight}px`;
					} else {
						infoMember.style.height = '';
					}
				});

			});
		});
	}
})();