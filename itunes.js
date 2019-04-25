$('#toggleSongs, .collection').hide();
$('.slider').slider({
    duration: 800
});


$('form').submit(function (event) {
    event.preventDefault();
    var query = $('#search').val();
    $('#search').val('');
    $('#search').blur();
    $('#toggleSongs').hide();
    $.ajax({
        url: "http://itunes.apple.com/search?term=" + query,
        dataType: 'JSONP'
    })
        .done(function (data) {
            $('.slider').show();
            console.log(data);
            var seen = {}
            var formattedData = [];
            // add code for when response from apple comes back.
            $('ul').html("")
            var numOfSlides = 0;
            for (var i = 0; i < data.results.length; i++) {
                console.log(i);

                if (data.results[i].trackName && numOfSlides < 5) {
                    data.results[i].artworkUrl100 = data.results[i].artworkUrl100.replace('100x100', '1000x1000')
                    if (seen[data.results[i].collectionId] === undefined) {
                        $('#songs').append(`
                    <li>
                        <img src="${data.results[i].artworkUrl100}"> <!-- random image -->
                        <div class="caption center-align">
                        <h3 class="green-text text-darken-3">${data.results[i].collectionName}</h3>
                        <h5 class="light grey-text text-lighten-3"><a id='${data.results[i].collectionId}' class="waves-effect waves-light btn yellow accent-4 show_songs">Listen Now</a></h5>
                        </div>
            
                    </li>
                    `)
                        seen[data.results[i].collectionId] = true;
                        numOfSlides++
                    }

                }
                formattedData.push({
                    "name": data.results[i].trackName,
                    "artist": data.results[i].artistName,
                    "album": data.results[i].collectionName,
                    "url": data.results[i].previewUrl,
                    "cover_art_url": data.results[i].artworkUrl100
                })
            }

            console.log(formattedData);
            $('.show_songs').click(function () {
                var thisCollection = $(this).attr('id');
                $('.slider').hide();
                for (var i = 0; i < data.results.length; i++) {
                    console.log(thisCollection, data.results[i].collectionId);
                    if (thisCollection == data.results[i].collectionId) {
                        $('h1').html(data.results[i].collectionName)
                        break;
                    }
                }
                $('h1').html()
                for (var i = 0; i < data.results.length; i++) {
                    if (thisCollection == data.results[i].collectionId) {
                        console.log("test", thisCollection, data.results[i].collectionId);

                        $('.collection').append(`
                        <li class="collection-item avatar">
                        <div class="circle amplitude-play-pause" data-amplitude-song-index="${i}"></div>
                        <span class="title">${data.results[i].trackName}</span>
                        <p> ${data.results[i].artistName}<br>
                        $${data.results[i].trackPrice}
                        </p>
                        <a href="${data.results[i].trackViewUrl}" class="secondary-content"><i class="material-icons">shopping_cart</i></a>
                      </li>
                        `)
                    }
                }
                Amplitude.init({
                    "songs": formattedData
                })
                $('#toggleSongs, .collection').show();
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutationRecord) {
                        console.log('style changed!');
                    });    
                });
                
                var target = document.getElementById("songList")
                observer.observe(target, { attributes : true, attributeFilter : ['style'] });
            })
            $('.slider').slider({
                duration: 800
            });
        })

        .fail(function (data) {
            console.log(data);
            $('#songs').append(data.status);
        })
});// End of on ready part



$('#toggleSongs').click(function () {
    $('.slider').show();
    $('#toggleSongs').hide();
    $('.collection').html("");
    Amplitude.pause();

})


