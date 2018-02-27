//----------------------------- Modelo -----------------------------------//

/**
 * Represents a Movie.
 * @constructor
 * @param {string} title - The title of the movie.
 * @param {string} year - The year of the movie.
 * @param {number} imdbID - The ID of the movie.
 * @param {string} type - The type of the movie.
 * @param {string} img - The image of the movie.
 */
class Movie {
    constructor(title, year, imdbid, type, poster) {
        this.title = title;
        this.year = year;
        this.imdbID = imdbid;
        this.type = type;
        this.img = poster;
    }

    /** Return the movie, with all the information about that movie */
    get MovieData() {
        return "Titulo: " + this.title + "<br/> Año: " + this.year + "<br/> ID: " + this.imdbid + "<br/> Género: " + this.type;
    }
}

/**
 * Represents a Array of movies.
 * @constructor
 * @param {array} collection - The collection of the movies.
 */
class movieCollection {
    constructor() {
        this.collection = [];
    }

    /** Add a new movie to collection of movies*/
    addToCollection(movie) {
        this.collection.push(movie)
    }

    /** Empty the collection of movies */
    emptyCollection() {
        this.collection = []
    }
}

// --------------------------------- Vista ------------------------------//

/**
 * Represents the view of a Movie.
 */
class viewMovie {
    /**
     * Add the new view of a Movie
     * @param {object} peli 
     */
    addmovie(peli) {
        this.view = $('#movie').append('<section id="' + peli.imdbID + '" class="box" seleccionada=false onclick="controlador.ajaxPetitionMovie(this.id)"><img src="' + peli.img + '" /><p>' + peli.title + ' ( ' + peli.year + ' )</p></section>');
    }
    /**
     * Add the new view of a Serie
     * @param {object} peli 
     */
    addseries(peli) {
        this.view = $('#series').append('<section  id="' + peli.imdbID + '" class="box" seleccionada=false onclick="controlador.ajaxPetitionMovie(this.id)"><img src="' + peli.img + '" /><p>' + peli.title + ' ( ' + peli.year + ' )</p></section>');
    }
    /**
     * Add the new view of a Game
     * @param {object} peli 
     */
    addgame(peli) {
        this.view = $('#game').append('<section  id="' + peli.imdbID + '" class="box" seleccionada=false onclick="controlador.ajaxPetitionMovie(this.id)"><img src="' + peli.img + '" /><p>' + peli.title + ' ( ' + peli.year + ' ) </p></section>');
    }

    /**
     * Empty the fields and inputs
     */
    defaultValues() {
        $('#movie').empty();
        $('#series').empty();
        $('#game').empty();
        $('#busqueda').val("");
        controlador.pagemovie = 0;
        controlador.pageseries = 0;
        controlador.pagegames = 0;
    }
    /** 
     * Load the structure of main content of the page
    */
    loadStructure() {
        $('#peliculastitulo').text("PELICULAS");
        $('#seriestitulo').text("SERIES");
        $('#juegostitulo').text("JUEGOS");
    }
    /**
     * Load the information of the information given with the html structure
     * @param {string} dis 
     * @param {string} img 
     * @param {string} title 
     * @param {number} year 
     * @param {string} runtime 
     * @param {string} sinopsis 
     * @param {string} actores 
     * @param {string} premios 
     */
    loadInformation(dis, img, title, year, runtime, sinopsis, actores, premios) {
        $('.informacion' + dis + '').append('<div class="monoinfor">' +
            '<img class="monofoto" src="' + img + '"/></div>' +
            '<table class="monotext">' +
            '<tr>' +
            '   <td><h3>Título: </h3></td>' +
            '   <td><h4> ' + title + '</h4></td>' +
            '</tr><tr>' +
            '   <td><h3>Año de salida: </h3></td>' +
            '   <td><h4> ' + year + '</h4></td>' +
            '</tr><tr>' +
            '   <td><h3>Duración: </h3></td>' +
            '   <td><h4> ' + runtime + '</h4></td>' +
            '</tr><tr>' +
            '   <td><h3>Sinopsis: </h3></td>' +
            '   <td><h4> ' + sinopsis + '</h4></td>' +
            '</tr><tr>' +
            '   <td><h3>Actores: </h3></td>' +
            '   <td><h4> ' + actores + '</h4></td>' +
            '</tr><tr>' +
            '   <td><h3>Premios: </h3></td>' +
            '   <td><h4> ' + premios + '</h4></td>' +
            '</tr><tr>' +
            '</table>' +
            '<img class="minimizar" src="imgs/mini.png"/>');
        $('.informacion' + dis + '').css({ 'margin-top': '100px' });
    }
    /**
     * Show the loading ico while the AJAX petition is in execution
     */
    showLoading() {
        $('#cargando').show();
    }
    /**
     * Hide the loading ico while the AJAX petition is in execution
     */
    hideLoading() {
        $('#cargando').css("display", "none"); // need to use this method instead .hide() because working with jQuery data cache repeatedly is better use .css
    }
}

//-------------------------------- Controlador ----------------------------------------//
/**
 * Generate the controlator which will controlate the information of the model and represent the view on the page
 * @constructor
 */
class Controlador {
    constructor() {
        let self = this;
        this.newview = new viewMovie();
        this.objCollection = new movieCollection();
        this.pagemovie = 0;
        this.pageseries = 0;
        this.pagegames = 0;
        this.cargando = false;
        this.page;
        $('#gran').click(() => {
            self.newview.defaultValues();
            $('#peliculastitulo').text("");
            $('#seriestitulo').text("");
            $('#juegostitulo').text("");
            $('.informacionmovie').empty();
            $('.informacionseries').empty();
            $('.informaciongame').empty();
        })
    }
    /**
     * This method will make the AJAX request with the information of
     * all the movies, series and games that have been found with the 
     * information provided by the user.
     */
    cargaAll() {
        this.busqueda = $('#busqueda').val();
        this.newview.defaultValues();
        this.newview.loadStructure();
        this.alltypes = ['movie', 'series', 'game'];
        this.alltypes.forEach(function (elem) {
            controlador.ajaxPetitionAll(elem);
        })
    }
    /**
     * This method will will be clean the page of the previous information and
     * will do the AJAX petition , also will controlate the number page, the 
     * information obtained from the request will be stored in the 
     * respective collection, depending on its own type. Controlate the boolean
     * for loading ico.
     * @param {string} tipo 
     */
    ajaxPetitionAll(tipo = "") {
        $('.informacionmovie').hide("fast");
        $('.informacionmovie').empty();
        $('.informacionseries').hide("fast");
        $('.informacionseries').empty();
        $('.informaciongame').hide("fast");
        $('.informaciongame').empty();
        let self = this;
        if (tipo == 'movie') {
            controlador.pagemovie++;
            controlador.page = controlador.pagemovie;
        }
        else if (tipo == 'series') {
            controlador.pageseries++;
            controlador.page = controlador.pageseries;
        }
        else if (tipo == 'game') {
            controlador.pagegames++;
            controlador.page = controlador.pagegames;
        }
        $.ajax({
            url: 'http://www.omdbapi.com/?apikey=e06027ef&s=' + this.busqueda + '&page=' + controlador.page + '&type=' + tipo + '',
            success: function (json) {
                if (json['Search'] == undefined) {
                    console.log("Se acabaron las busquedas, amigo");
                    let vistita = new viewMovie();
                    vistita.hideLoading()
                }
                else {
                    for (let num = 0; num < json['Search'].length; num++) {
                        this.newmovie = new Movie(json['Search'][num].Title, json['Search'][num].Year, json['Search'][num].imdbID,
                            json['Search'][num].Type, json['Search'][num].Poster == "N/A" ? "imgs/foto1.png" : json['Search'][num].Poster);
                        if (json['Search'][num].Type == "movie") {
                            controlador.newview.addmovie(this.newmovie);
                        }
                        else if (json['Search'][num].Type == "series") {
                            controlador.newview.addseries(this.newmovie);
                        }
                        else if (json['Search'][num].Type == "game") {
                            controlador.newview.addgame(this.newmovie);
                        }
                    }
                    self.objCollection.addToCollection(this.newmovie);
                    controlador.cargando = false;
                    controlador.LoadingIco();
                }
            }
        });

    }
    /**
     * It will do the AJAX petition of the imdbID movie / serie / game given
     * that ID will be obtained for the param
     * @param {number} imdbid 
     */
    ajaxPetitionMovie(imdbid) {
        let self = this;
        $('.informacionmovie').empty();
        $('.informacionseries').empty();
        $('.informaciongame').empty();
        $.ajax({
            url: 'http://www.omdbapi.com/?apikey=e06027ef&i=' + imdbid + '',
            success: function (json) {
                $('.informacionmovie').show("fast");
                $('.informacionseries').show("fast");
                $('.informaciongame').show("fast");
                self.newview.loadInformation(json.Type, json.Poster == "N/A" ? "imgs/foto1.png" : json.Poster, json.Title, json.Year, json.Runtime, json.Plot, json.Actors, json.Awards);
                $('.minimizar').click(function () {
                    $('.informacion' + json.Type + '').hide(1000);
                    $('.informacion' + json.Type + '').empty();

                })

            }
        })

    }
    /** 
     * Eliminate the vertical scroll and switch it for horizontal scroll in the
     * sections where will be appear the results of the AJAX petition
    */
    HorizontalScroll() {
        $("section").bind("mousewheel DOMMouseScroll", function (e) {
            var scrollTo = 0;
            if (e.type == 'mousewheel') {
                scrollTo = (e.originalEvent.wheelDelta * -1);
            }
            else if (e.type == 'DOMMouseScroll') {
                scrollTo = 30 * e.originalEvent.detail;
            }
            $(this).scrollLeft(scrollTo + $(this).scrollLeft());
            e.preventDefault();
        })
    }
    /** 
     * Give the page the infinite scroll, controlling that can't load a new page if
     * the actual page is loading, therefore ,need to wait until the petition finish 
     * for do the next petition, also control the loading icon
    */
    loadNewPage() {
        $("section").on("scroll", function (e) {
            let sectionIN = $(this).attr('id');
            if (controlador.check($(this).attr('id'))) {
                if (!controlador.cargando) {
                    $(this).ready(function () {
                        controlador.ajaxPetitionAll(sectionIN);
                        controlador.cargando = true;
                        controlador.LoadingIco();
                    }
                    )
                }
            }
        })
    }

    /**
     * This method control that the horizontal scroll is over the last item
     * for load more information , this complements the infinite scroll,
     * thanks this, we avoid that there are buttons to load more information.
     * @param {string} where 
     */
    check(where) {
        this.docViweLeft = $(window).scrollLeft();
        this.docViewBottom = this.docViweLeft + $(window).width();
        this.elemLeft = $('#' + where + ' .box:last').offset().left;
        this.elemBottom = this.elemLeft + $('#' + where + '.box:last').width();
        return ((this.elemBottom <= this.docViewBottom) && (this.elemLeft >= this.docViweLeft));

    }
    /** 
     * Give / Delete css styles depending the focus or if the toggle is active 
     */
    Searcher() {
        $('button').click((e) => {
            e.preventDefault();
            $('.search-form').toggleClass('active');
            $('#flechita').remove();
        });
        $('.search-form').focus(() => {
            $('.search-form').addClass('focus');
        })
        $('.search-form').blur(() => {
            $('input').val().length != 0 ? $('.search-form').addClass('focus') : $('.search-form').removeClass('focus');
        })

    }
    /**
     * The method which control the view of the loading icon
     */
    LoadingIco() {
        if (controlador.cargando == true) {
            let vistita = new viewMovie();
            vistita.showLoading()
        } else if (controlador.cargando == false) {
            let vistita = new viewMovie();
            vistita.hideLoading()
        }
    }
}

let controlador = new Controlador();
controlador.HorizontalScroll();
controlador.loadNewPage();
controlador.LoadingIco();
controlador.Searcher();


