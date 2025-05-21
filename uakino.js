(function(){
    if (!window.Lampa) return;

    Lampa.Sources.add('UAKino', {
        title: 'UAKino',
        component: 'video',
        search: function(query, callback){
            fetch(`https://uakino.club/index.php?do=search&subaction=search&story=${encodeURIComponent(query)}`)
                .then(res => res.text())
                .then(html => {
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    const items = [...doc.querySelectorAll('.short-film')];

                    const results = items.map(el => {
                        const url = el.querySelector('a')?.href;
                        const title = el.querySelector('a')?.textContent?.trim();
                        const img = el.querySelector('img')?.src;

                        return {
                            title: title,
                            url: url,
                            quality: 'HD',
                            info: '',
                            poster: img,
                            player: true
                        };
                    });

                    callback(results);
                });
        },
        play: function(item, callback){
            fetch(item.url)
                .then(res => res.text())
                .then(html => {
                    const iframeMatch = html.match(/<iframe.*?src="(.*?)"/i);
                    if (iframeMatch) {
                        // Часто відео через iframe-плеєр з іншого сайту
                        callback([{
                            file: iframeMatch[1],
                            quality: 'HD',
                            title: 'UAKino Плеєр',
                            stream: true // повідомляє Lampa що це iframe
                        }]);
                    } else {
                        Lampa.Noty.show('Не знайдено відео');
                        callback([]);
                    }
                });
        }
    });
})();
