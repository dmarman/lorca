const lorca = require('../lorca.js');

describe("get reading time", function () {
  it("should return 2.72", function () {
    var doc = lorca('El niño ha sido castigado. La madre lo ha castigado.');
    var output = doc.readingTime();
    expect(output).toEqual(2.727272727272727);
  });
});
