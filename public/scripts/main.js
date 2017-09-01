/////////////////////////////
////    client side     ////
///////////////////////////
$(function() {


    //add active class to first element of dynamically generated carousel items
    $(".carousel-item:first").addClass("active");

    //logic for infinite scrolling of movie carousel
    //append finite list items again at end to ensure infinite scrolling
    $('#movieCarousel').on('slide.bs.carousel', function(e) {

        var $e = $(e.relatedTarget);
        var idx = $e.index();
        var itemsPerSlide = 6;
        var totalItems = $('.carousel-item').length;

        if (idx >= totalItems - (itemsPerSlide - 1)) {
            var it = itemsPerSlide - (totalItems - idx);
            for (var i = 0; i < it; i++) {
                // append slides to end of list
                if (e.direction == "left") {
                    $('.carousel-item').eq(i).appendTo('.carousel-inner');
                } else {
                    $('.carousel-item').eq(0).appendTo('.carousel-inner');
                }
            }
        }
    });
    //call to check if there are previously viewed videos and to add them to DOM
    populateHistoryCarousel();

    //fancybox displays video with autoplay in fullscreen mode
    //adding event listeners for video play and end
    $("[data-fancybox]").fancybox({

        fullScreen: {
            autoStart: true,
        },

        afterShow: function(instance, current) {
            //close the fancybox on video end automatically
            current.$content.find('video')[0].addEventListener("ended", function() {

                if (current.$content.find('video')[0].ended) {
                    instance.close();
                }
            }, false);
            //when video play starts add this current video to localStorage to retrieve for historyCarousel
            current.$content.find('video')[0].addEventListener("play", function() {

                var storedHistory = JSON.parse(localStorage.getItem("movieHistory")) || [];

                //if video doesn't already exist in list then only add it
                if (!(JSON.stringify(localStorage.getItem("movieHistory")).includes(current.$content.find('video')[0].title))) {

                    var recentMovie = current.$content.find('video')[0].title + '~' + current.$content.find('video')[0].currentSrc + '~' + current.$content.find('video')[0].poster;


                    storedHistory.push(recentMovie);

                    localStorage.setItem('movieHistory', JSON.stringify(storedHistory));
                    //show this last added item in the historyCarousel
                    populateHistoryCarousel();

                }




            });
            //trigger play for the current video, as autoplay attribute in video doesn't work well in fancybox
            current.$content.find('video')[0].play();
        }
    });

    //get local storage and use it to populate the historyCarousel 
    function populateHistoryCarousel() {

        if (JSON.parse(localStorage.getItem("movieHistory"))) {

            $("#history").text('Previously watched');
            var movieHistoryList = JSON.parse(localStorage.getItem("movieHistory"));
            $('#historyCarouselInner').empty();
            for (var i = movieHistoryList.length - 1; i >= 0; i--) {


                $('#historyCarouselInner').append('<div class="carousel-item col-md-2 col-sm-6 show"> <a data-fancybox data-src="#history' + i + '"' + ' href="javascript;">' + '<div id="history' + i + '"' + ' style="display:none;width:100%;height:100%;"><div class="videotitle">' + movieHistoryList[i].split("~")[0] + '</div><video controls title="' + movieHistoryList[i].split("~")[0] + '"' + ' poster=' +
                    movieHistoryList[i].split("~")[2] + '><source src=' + movieHistoryList[i].split("~")[1] + '></source></video></div>' + '<img class="img-fluid mx-auto d-block" src=' + movieHistoryList[i].split("~")[2] + '><p class="title">' + movieHistoryList[i].split("~")[0] + '</p></a> </div>');



            }
            $("#historyCarouselContainer").show();

        }
        //if empty display text
        else {

            $("#history").text('You have not watched any videos recently!');
        }


    }




});