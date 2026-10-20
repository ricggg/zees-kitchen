export const site = {
  name: "Zee's Kitchen",
  tagline: 'Try Dey Chop!',
  city: 'Asaba',
  // Numbers supplied by Zee's Kitchen.
  phone: '08071595475',
  whatsapp: '09060474800',
  services: ['Fresh food', 'Fast delivery', 'Home-taste guaranteed', 'Indoor & outdoor catering'],
};
export const waLink = (msg = "Hello Zee's Kitchen") =>
  `https://wa.me/234${site.whatsapp.slice(1)}?text=${encodeURIComponent(msg)}`;
