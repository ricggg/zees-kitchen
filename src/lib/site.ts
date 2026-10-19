export const site = {
  name: "Zee's Kitchen",
  tagline: 'Try Dey Chop!',
  city: 'Asaba',
  // Taken from the banner — confirm before launch.
  phone: '08071585475',
  whatsapp: '07066448523',
  services: ['Fresh food', 'Fast delivery', 'Home-taste guaranteed', 'Indoor & outdoor catering'],
};
export const waLink = (msg = "Hello Zee's Kitchen") =>
  `https://wa.me/234${site.whatsapp.slice(1)}?text=${encodeURIComponent(msg)}`;
