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
            fetch(`https://uakino-parser.onrender.com/api/uakino?url=${encodeURIComponent(item.url)}`)
                .then(res => res.json())
                .then(json => {
                    if (json.video) {
                        callback([{
                            file: json.video,
                            quality: 'HD',
                            title: 'UAKino'
                        }]);
                    } else {
                        Lampa.Noty.show('Не знайдено відео');
                        callback([]);
                    }
                });
        }
    });
})();
