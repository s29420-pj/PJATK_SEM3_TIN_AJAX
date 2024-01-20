// app.js
$(document).ready(function () {
    const apiUrl = 'https://jsonplaceholder.typicode.com';

    // Pobieranie listy albumów
    $.ajax({
        url: `${apiUrl}/albums`,
        method: 'GET',
        success: function (albums) {
            displayAlbums(albums);
        },
        error: function (error) {
            console.error('Error fetching albums:', error);
        }
    });

    function displayAlbums(albums) {
        const albumsList = $('#albums');
        albumsList.empty();

        albums.forEach(album => {
            const listItem = `<li data-album-id="${album.id}">${album.title}</li>`;
            albumsList.append(listItem);
        });

        // Dodanie obsługi kliknięcia na album
        albumsList.find('li').click(function () {
            const albumId = $(this).data('album-id');
            // Przekazujemy id albumu do funkcji wyświetlającej galerię
            displayGallery(albumId);
        });
    }

    function displayGallery(albumId) {
        // Pobieranie danych z wybranego albumu
        $.ajax({
            url: `${apiUrl}/photos?albumId=${albumId}`,
            method: 'GET',
            success: function (photos) {
                displayGalleryDetails(albumId, photos);
            },
            error: function (error) {
                console.error('Error fetching photos:', error);
            }
        });
    }

    function displayGalleryDetails(albumId, photos) {
        const galleryTitle = $('#gallery-title');
        const thumbnailsContainer = $('#thumbnails');
        const addPhotoForm = $('#add-photo-form');

        // Wstawianie danych do DOM
        galleryTitle.text(`Gallery for Album ${albumId}`);
        thumbnailsContainer.empty();

        photos.forEach(photo => {
            const thumbnail = `<img src="${photo.thumbnailUrl}" alt="${photo.title}" data-photo-url="${photo.url}">`;
            thumbnailsContainer.append(thumbnail);
        });

        // Dodanie obsługi kliknięcia na miniaturkę
        thumbnailsContainer.find('img').click(function () {
            const photoUrl = $(this).data('photo-url');
            openLightbox(photoUrl);
        });

        // Wyświetlanie galerii
        $('#gallery-list').hide();
        $('#gallery-details').show();

        // Obsługa dodawania nowego zdjęcia (formularz)
        addPhotoForm.off('submit').submit(function (event) {
            event.preventDefault();
            const photoTitle = $('#photo-title').val();
            const photoUrl = $('#photo-url').val();

            // Wysłanie danych nowego zdjęcia na serwer
            addNewPhoto(albumId, photoTitle, photoUrl);
        });

        // Przycisk do powrotu do listy albumów
        $('#back-to-albums').off('click').click(function () {
            backToAlbums();
        });
    }

    function backToAlbums() {
        // Resetowanie formularza dodawania zdjęcia
        $('#add-photo-form')[0].reset();

        // Ukrycie galerii i pokazanie listy albumów
        $('#gallery-list').show();
        $('#gallery-details').hide();
    }

    function addNewPhoto(albumId, title, url) {
        $.ajax({
            url: `${apiUrl}/photos`,
            method: 'POST',
            data: {
                albumId: albumId,
                title: title,
                url: url,
                thumbnailUrl: url // Zakładamy, że thumbnailUrl jest takie samo jak url dla prostoty
            },
            success: function (newPhoto) {
                // Dodanie nowego zdjęcia do galerii
                const thumbnail = `<img src="${newPhoto.thumbnailUrl}" alt="${newPhoto.title}" data-photo-url="${newPhoto.url}">`;
                $('#thumbnails').append(thumbnail);
            },
            error: function (error) {
                console.error('Error adding photo:', error);
            }
        });
    }

    function openLightbox(photoUrl) {
        const lightbox = $('#lightbox');
        const lightboxImage = $('#lightbox-image');

        // Ustawienie źródła obrazu w lightboxie
        lightboxImage.attr('src', photoUrl);

        // Pokazanie lightboxa
        lightbox.show();

        // Dodanie obsługi kliknięcia do zamknięcia lightboxa
        lightbox.find('.close').click(function () {
            closeLightbox();
        });
    }

    function closeLightbox() {
        const lightbox = $('#lightbox');
        // Ukrycie lightboxa
        lightbox.hide();
    }
});
