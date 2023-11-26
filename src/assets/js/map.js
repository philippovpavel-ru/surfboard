import ymaps from 'ymaps';

(function () {
	ymaps.load().then(maps => {
		const map = new maps.Map('map', {
			center: [55.752004, 37.576133],
			zoom: 16,
			controls: [],
		});

		let coords = [
			[55.752004, 37.576133],
		];

		const collection = new maps.GeoObjectCollection({}, {
			draggable: false,
			iconLayout: 'default#image',
			iconImageHref: 'assets/img/marker.png',
			iconImageSize: [58, 73],
			iconImageOffset: [-35, -52]
		});

		for (let i = 0; i < coords.length; i++) {
			collection.add(new maps.Placemark(coords[i]));
		}

		map.geoObjects.add(collection);

		map.behaviors.disable('scrollZoom');
	}).catch(error => console.log('Failed to load Yandex Maps', error));
})();