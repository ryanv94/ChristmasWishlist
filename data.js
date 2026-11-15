// Ryan's wishlist. `img` is the file number in assets/img (no file = typographic tile).
// size: s = small, w = wide, b = big. tone: paper | brass | rose. fit: contain | cover.
window.WISHES = [
  { id: "luxo", img: "04", title: "Luxo Jr. lamp", note: "LEGO set 21357, Disney Pixar", cat: "LEGO", store: "LEGO", price: 69.99, url: "https://www.lego.com/en-ie/product/disney-pixar-luxo-jr-21357", size: "b" },
  { id: "secrid", img: "06", title: "Secrid Slim Wallet", note: "Matte night blue and orange", cat: "Accessories", store: "Secrid", price: 69.99, url: "https://secrid.com/en-ie/slimwallet-matte-nightblue-orange/", size: "s" },
  { id: "mx4", img: "24", title: "Logitech MX Master 4", note: "Developer edition. If that's gone, any MX Master 4 is perfect", cat: "Tech", store: "Logitech", price: 129.99, url: "https://www.logitech.com/en-ie/shop/p/mx-master-4-special-edition.910-008020", size: "s", fit: "cover" },
  { id: "gshock", img: "31", title: "Casio G-Shock GA-2000", note: "Analogue and digital", cat: "Accessories", store: "Amazon UK", price: 116.0, url: "https://www.amazon.co.uk/dp/B07RRR54LX", size: "s" },
  { id: "airtag", img: "23", title: "Apple AirTag", note: "Can never have too many", cat: "Tech", store: "Apple", price: 35.0, url: "https://www.apple.com/ie/shop/buy-airtag/airtag/1-pack", size: "s" },

  { id: "trex", img: "02", title: "Tyrannosaurus rex fossil", note: "LEGO set 76968", cat: "LEGO", store: "LEGO", price: 249.99, url: "https://www.lego.com/en-ie/product/dinosaur-fossils-tyrannosaurus-rex-76968", size: "w" },
  { id: "dc3", img: "03", title: "Douglas DC-3 Pan Am airliner", note: "LEGO set 11378", cat: "LEGO", store: "LEGO", price: 219.99, url: "https://www.lego.com/en-ie/product/douglas-dc-3-pan-am-airliner-11378", size: "w" },

  { id: "p6", img: "07", title: "Patagonia P-6 Logo Uprisal Hoody", note: "Men's", cat: "Clothing", store: "Patagonia", price: 100.0, url: "https://eu.patagonia.com/ie/en/product/mens-p-6-logo-uprisal-hoody/198077984740.html", size: "s" },
  { id: "daily", img: "08", title: "Patagonia Daily Hoody", note: "Men's", cat: "Clothing", store: "Patagonia", price: 120.0, url: "https://eu.patagonia.com/ie/en/product/mens-daily-hoody/199346045537.html", size: "s" },
  { id: "bsqz", img: "09", title: "Patagonia Better Sweater quarter-zip", note: "Fleece, men's", cat: "Clothing", store: "Patagonia", price: 140.0, url: "https://eu.patagonia.com/ie/en/product/mens-better-sweater-quarter-zip-fleece/25523.html?dwvar_25523_color=NENA", size: "s" },
  { id: "carhartt", img: "15", title: "Carhartt Paxton quarter-zip sweatshirt", note: "Brown or green, size L", cat: "Clothing", store: "Carhartt", price: 79.99, url: "https://www.carhartt.com/en-eu/p/paxton-14-zip-sweatshirt/100617", size: "s" },

  { id: "wallace", img: "01", title: "Wallace & Gromit", note: "LEGO set 21371", cat: "LEGO", store: "LEGO", price: 99.99, url: "https://www.lego.com/en-ie/product/wallace-gromit-21371", size: "b", right: true },
  { id: "bonsai", img: "25", title: "Bonsai tree", note: "LEGO set 10281", cat: "LEGO", store: "LEGO", price: 49.99, url: "https://www.lego.com/en-ie/product/bonsai-tree-10281", size: "s" },
  { id: "sunflower", img: "26", title: "Sunflower bouquet", note: "LEGO set 11502", cat: "LEGO", store: "LEGO", price: 59.99, url: "https://www.lego.com/en-ie/product/sunflower-bouquet-11502", size: "s" },
  { id: "gameboy", img: "27", title: "Game Boy", note: "LEGO set 72046", cat: "LEGO", store: "LEGO", price: 59.99, url: "https://www.lego.com/en-ie/product/game-boy-72046", size: "s" },
  { id: "cloudtilt", img: "18", title: "On Cloudtilt Remix", note: "Size 47.5", cat: "Clothing", store: "On", price: 170.0, url: "https://www.on.com/en-ie/products/cloudtilt-remix-m-3mg1027/mens/autumn-ivory-shoes-3MG10275230", size: "s" },

  { id: "modelt", img: "05", title: "Ford Model T", note: "LEGO set 11376", cat: "LEGO", store: "LEGO", price: 129.99, url: "https://www.lego.com/en-ie/product/ford-model-t-11376", size: "w" },
  { id: "keychron", img: "16", title: "Keychron K4 Max", note: "Wireless QMK mechanical keyboard, Banana switches", cat: "Tech", store: "Amazon UK", price: 86.3, url: "https://www.amazon.co.uk/dp/B0DXBCTX7X", size: "w" },

  { id: "cmfm", img: "10", title: "CMF Speaker M", note: "Bluetooth. Turquoise or orange", cat: "Tech", store: "Nothing", price: 99.0, url: "https://ie.nothing.tech/products/cmf-speaker-m?Color=Orange", size: "w", fit: "cover" },
  { id: "edifier", img: "14", title: "Edifier M60 speakers", note: "White, Bluetooth multimedia speakers", cat: "Tech", store: "Amazon UK", price: 135.0, url: "https://www.amazon.co.uk/dp/B0D95R2PXM", size: "w" },

  { id: "cmfs", img: "11", title: "CMF Speaker S", note: "Bluetooth. Turquoise or orange", cat: "Tech", store: "Nothing", price: 59.99, url: "https://ie.nothing.tech/products/cmf-speaker-s?Color=Turquoise", size: "s", fit: "cover" },
  { id: "switchbot", img: "13", title: "SwitchBot floor lamp", note: "Matter, RGBICWW", cat: "Tech", store: "Amazon UK", price: 53.0, url: "https://www.amazon.co.uk/dp/B0FJFX6JK9", size: "s" },
  { id: "uniqlo", img: "12", title: "Uniqlo Henley shirt", note: "Size L, any colour", cat: "Clothing", store: "Uniqlo", price: 24.9, url: "https://www.uniqlo.com/eu-ie/en/products/E482766-000/00?colorDisplayCode=01&sizeDisplayCode=005", size: "s" },
  { id: "casio", img: "30", title: "Casio Classic quartz watch", note: "Stainless steel", cat: "Accessories", store: "Amazon UK", price: 37.84, url: "https://www.amazon.co.uk/dp/B07G353VXZ", size: "s" },

  { id: "puck", img: "19", title: "Espresso puck screen", note: "58.35mm", cat: "Coffee", store: "Amazon UK", price: 16.0, url: "https://www.amazon.co.uk/dp/B0G5PWHL52", size: "s" },
  { id: "distro", img: "20", title: "Coffee distribution tool", note: "58mm", cat: "Coffee", store: "Amazon UK", price: 36.98, url: "https://www.amazon.co.uk/dp/B0DQPPT85Y", size: "s" },
  { id: "tamp", img: "21", title: "Coffee tamping station", note: "58mm", cat: "Coffee", store: "Amazon UK", price: 43.0, url: "https://www.amazon.co.uk/dp/B0GT42HF5Z", size: "s" },
  { id: "case", img: "22", title: "iPhone TechWoven case", note: "With MagSafe, Mulberry. For iPhone 18 Pro Max", cat: "Accessories", store: "Apple", price: 69.0, url: "https://www.apple.com/ie/shop/product/mkdn4zm/a/iphone-18-pro-max-techwoven-case-with-magsafe-mulberry", size: "s" },

  { id: "vac", img: "17", title: "HOTO cordless car vacuum", note: "Handheld and portable", cat: "Car", store: "Amazon UK", price: 81.99, url: "https://www.amazon.co.uk/dp/B0GYSHD9JL", size: "w" },
  { id: "foamer", img: "28", title: "Snow foam machine", note: "For washing the car", cat: "Car", store: "Amazon UK", price: 18.48, url: "https://www.amazon.co.uk/dp/B07T6KS5BJ", size: "s" },
  { id: "foam", img: "29", title: "Snow foam", note: "The soap to go in the machine", cat: "Car", store: "Amazon UK", price: 20.0, url: "https://www.amazon.co.uk/dp/B079QNQL1R", size: "s" }
];
