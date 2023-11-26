(function () {
	const videoplayers = document.querySelectorAll('.video');
	if (videoplayers.length < 1) return;

	videoplayers.forEach(videoplayer => {
		const mainPlayBTN = videoplayer.querySelector('.video__player-btn'),
			secondPlayBTN = videoplayer.querySelector('.duration__play-btn'),
			playBTNs = [mainPlayBTN, secondPlayBTN],
			durationControl = videoplayer.querySelector('.duration__range'),
			soundControl = videoplayer.querySelector('.sound__level-range'),
			soundBTN = videoplayer.querySelector('.sound__btn'),
			video = videoplayer.querySelector('video');

		let intervalId,
			soundLevel;

		window.addEventListener('load', function () {
			video.addEventListener('click', playStop);

			for (let i = 0; i < playBTNs.length; i++) {
				playBTNs[i].addEventListener('click', playStop);
			}

			durationControl.min = 0;
			durationControl.value = 0;
			durationControl.max = video.duration;
			durationControl.addEventListener('input', setVideoDuration);

			soundControl.min = 0;
			soundControl.max = 10;
			soundControl.value = soundControl.max;
			soundControl.addEventListener('input', changeSoundVolume);

			soundBTN.addEventListener('click', soundOf);
		});

		video.addEventListener('ended', () => {
			mainPlayBTN.classList.toggle('video__player-btn--active');
			secondPlayBTN.classList.remove('duration__play-btn--pause');
			video.currentTime = 0;
		});

		function playStop() {
			mainPlayBTN.classList.toggle('video__player-btn--active');
			secondPlayBTN.classList.toggle('duration__play-btn--pause');

			if (video.paused) {
				video.play();
				intervalId = setInterval(updateDuration, 1000 / 60);
			} else {
				clearInterval(intervalId);
				video.pause();
			}
		}

		function setVideoDuration() {
			video.currentTime = durationControl.value;
			updateDuration();
		}

		function updateDuration() {
			durationControl.value = video.currentTime;
			let step = video.duration / 100;
			let percent = video.currentTime / step;
			durationControl.style.background = `linear-gradient(90deg, #FEDB3F 0%, #FEDB3F ${percent}%, #626262 ${percent}%)`;
		}

		function changeSoundVolume() {
			video.volume = soundControl.value / 10;
			if (video.volume === 0) {
				soundBTN.classList.add('sound__btn--active');
			} else {
				soundBTN.classList.remove('sound__btn--active');
			}
		}

		function soundOf() {
			if (video.volume === 0) {
				video.volume = soundLevel;
				soundControl.value = soundLevel * 10;
				soundBTN.classList.remove('sound__btn--active');
			} else {
				soundLevel = video.volume;
				video.volume = 0;
				soundControl.value = 0;
				soundBTN.classList.add('sound__btn--active');
			}
		}
	});
})();