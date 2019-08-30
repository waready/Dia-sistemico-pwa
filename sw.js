importScripts('assets/js/sw-utils.js');

const Static_cache    = 'static-v3';
const Dynamic_cache   = 'dynamic-v1';
const Inmutalbe_cache = 'inmutable-v1';


const APP_SHELL = [
   // '/',
    'index.html',
    // 'img/favicon.ico',
    'assets/js/app.js',
    'assets/js/sw-utils.js',
    'assets/js/main.js',
    'assets/css/main.css',
    'assets/img/logo.png'
    
   

];

const APP_SHELL_INMUTABLE = [
    'assets/css/bootstrap.min.css',
    "assets/css/font-awesome.min.css",
    "assets/css/et-line.css",
    "assets/css/ionicons.min.css",
    "assets/css/owl.carousel.min.css",
    "assets/css/owl.theme.default.min.css",
    "assets/css/animate.min.css",
    "assets/js/jquery.min.js",
    "assets/js/popper.js",
    "assets/js/bootstrap.min.js",
    "assets/js/waypoints.min.js",
    "assets/js/owl.carousel.min.js",
    "assets/js/parallax.min.js",
    "assets/js/jquery.counterup.min.js",
    "assets/js/jquery.countdown.min.js",
    "assets/js/wow.min.js"
];

self.addEventListener('install', e =>{
    const cacheStatic = caches.open(Static_cache).then(cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(Inmutalbe_cache).then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
});

self.addEventListener('activate', e =>{
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key =>{
            if( key !== Static_cache && key.includes('static')){
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
})

self.addEventListener ('fetch', e => {

    const respuesta = caches.match( e.request ).then( resp =>{
        if (resp){
            return resp;
        }
        else{
            return fetch (e.request).then(newRes =>{
                return actualizaCacheDinamico(Dynamic_cache, e.request,newRes);
            })
        }
    });

    e.respondWith(respuesta);

})