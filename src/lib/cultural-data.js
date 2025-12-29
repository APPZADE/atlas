export const culturalData = {
    "Turkey": {
        cuisine: [
            { name: "İskender Kebap", desc: "Bursa'nın meşhur döneri, tereyağı ve yoğurt sosu." },
            { name: "Baklava", desc: "İnce yufka, fıstık ve şerbetin muhteşem uyumu." },
            { name: "Mantı", desc: "Sarımsaklı yoğurt ile servis edilen minik hamur işi." }
        ],
        sights: [
            { name: "Ayasofya", desc: "İstanbul'un tarihi mirası, mühendislik harikası." },
            { name: "Kapadokya", desc: "Peri bacaları ve sıcak hava balonları." },
            { name: "Pamukkale", desc: "Beyaz travertenler ve antik havuz." }
        ],
        phrases: [
            { original: "Merhaba", tr: "Merhaba", pron: "Mer-ha-ba" },
            { original: "Teşekkürler", tr: "Teşekkürler", pron: "Te-shek-kur-ler" }
        ]
    },
    "Italy": {
        cuisine: [
            { name: "Pizza Napoletana", desc: "Odun ateşinde pişen, ince kenarlı klasik." },
            { name: "Pasta Carbonara", desc: "Yumurta, peynir ve guanciale ile yapılan Roma usulü makarna." }
        ],
        sights: [
            { name: "Kolezyum", desc: "Antik Roma'nın devasa amfitiyatrosu." },
            { name: "Venedik Kanalları", desc: "Gondol turu ile ünlü romantik su yolları." }
        ],
        phrases: [
            { original: "Ciao", tr: "Merhaba/Hoşçakal", pron: "Chao" },
            { original: "Grazie", tr: "Teşekkürler", pron: "Grat-zi-e" }
        ]
    },
    "Japan": {
        cuisine: [
            { name: "Sushi", desc: "Taze balık ve sirkeli pirinç sanatı." },
            { name: "Ramen", desc: "Zengin et suyu ve erişte çorbası." }
        ],
        sights: [
            { name: "Fuji Dağı", desc: "Japonya'nın ikonik ve kutsal yanardağı." },
            { name: "Kyoto Tapınakları", desc: "Geleneksel Japon mimarisi ve zen bahçeleri." }
        ],
        phrases: [
            { original: "Konnichiwa", tr: "Merhaba", pron: "Kon-ni-chi-wa" },
            { original: "Arigato", tr: "Teşekkürler", pron: "A-ri-ga-to" }
        ]
    },
    "United States": {
        cuisine: [
            { name: "Hamburger", desc: "Dünya klasiği ızgara köfteli sandviç." },
            { name: "Apple Pie", desc: "Geleneksel elmalı turta." }
        ],
        sights: [
            { name: "Özgürlük Heykeli", desc: "New York'un özgürlük sembolü." },
            { name: "Büyük Kanyon", desc: "Arizona'daki devasa doğal kanyon." }
        ],
        phrases: [
            { original: "Hello", tr: "Merhaba", pron: "He-lo" },
            { original: "Thanks", tr: "Teşekkürler", pron: "Thenks" }
        ]
    }
    // Fallback? We will handle missing data in component.
};
