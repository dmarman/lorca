const lorca = require('../lorca.js');

describe("tf-idf", function () {
    it("should return sorted list", function () {
        var doc = lorca('En verano hace calor. En invierno hace frío. El verano me gusta');
        var output = doc.tfidf().sort().get();
    expect(output).toEqual({ verano: 4117.747963402167,
                            invierno: 2660.600722826124,
                            frío: 2192.690048750771,
                            calor: 2186.3476209394835,
                            gusta: 2068.4919519114765,
                            hace: 478.20393517589827,
                            me: -748.0756841870855,
                            el: -2833.037926222993,
                            en: -5539.036281420974 });
    });

    it("should return sorted list", function () {
        var doc = lorca('En verano hace calor. En invierno hace frío. El verano me gusta');
        var output = doc.tfidf().sort(2).get();
    expect(output).toEqual({ verano: 4117.747963402167,
                            invierno: 2660.600722826124});
    });

}); 
