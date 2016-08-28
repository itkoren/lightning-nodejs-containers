// Full list of configuration options available here:
// https://github.com/hakimel/reveal.js#configuration
var queryHash = Reveal.getQueryHash();
Reveal.initialize({
    // Display controls in the bottom right corner
    controls: true,

    // Display a presentation progress bar
    progress: true,

    // Display the page number of the current slide
    slideNumber: true,

    // Push each slide change to the browser history
    history: true,

    // Enable keyboard shortcuts for navigation
    keyboard: true,

    // Enable the slide overview mode
    overview: true,

    // Vertical centering of slides
    center: true,

    // Enables touch navigation on devices with touch input
    touch: true,

    // Loop the presentation
    loop: false,

    // Change the presentation direction to be RTL
    rtl: false,

    // Turns fragments on and off globally
    fragments: true,

    // Flags if the presentation is running in an embedded mode,
    // i.e. contained within a limited portion of the screen
    embedded: false,

    // Number of milliseconds between automatically proceeding to the
    // next slide, disabled when set to 0, this value can be overwritten
    // by using a data-autoslide attribute on your slides
    autoSlide: 0,

    // Stop auto-sliding after user input
    autoSlideStoppable: true,

    // Enable slide navigation via mouse wheel
    mouseWheel: false,

    // Hides the address bar on mobile devices
    hideAddressBar: true,

    // Opens links in an iframe preview overlay
    previewLinks: false,

    theme: queryHash.theme, // available themes are in /css/theme

    // Transition style
    transition: queryHash.transition || "default", // default/cube/page/concave/zoom/linear/fade/none

    // Transition speed
    transitionSpeed: "default", // default/fast/slow

    // Transition style for full page slide backgrounds
    backgroundTransition: "default", // default/none/slide/concave/convex/zoom

    // Number of slides away from the current that are visible
    viewDistance: 3,

    // Parallax scrolling
    // parallaxBackgroundImage: "https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg",
    // parallaxBackgroundSize: "2100px 900px",

//	multiplex: {
//		// Example values. To generate your own, see the socket.io server instructions.
//		secret: "13981818338918672164", // Obtained from the socket.io server. Gives this (the master) control of the presentation
//		id: "d95282adc96a09f1", // Obtained from socket.io server
//		url: "ln.itkoren.com:1948" // Location of socket.io server
//	},

    // Optional libraries used to extend on reveal.js
    dependencies: [
        // and if you want speaker notes
        { src: "http://gh.itkoren.com/revealular/reveal.js/lib/js/classList.js", condition: function() { return !document.body.classList; } },

        { src: "http://gh.itkoren.com/revealular/reveal.js/plugin/highlight/highlight.js", async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
        { src: "http://gh.itkoren.com/revealular/reveal.js/plugin/zoom-js/zoom.js", async: true, condition: function() { return !!document.body.classList; } },
        // { src: "http://gh.itkoren.com/revealular/reveal.js/plugin/search/search.js", async: true, condition: function() { return !!document.body.classList; } },
        { src: "http://gh.itkoren.com/revealular/reveal.js/plugin/notes/notes.js", async: true, condition: function() { return !!document.body.classList; } },

        // Browser Console Speaker Notes
        { src: "http://gh.itkoren.com/revealular/js/console-notes.js", async: true, condition: function() { return !!document.body.classList; } }
    ]
});
