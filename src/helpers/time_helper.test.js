const { checkRestaurantOpen } = require('../../src/helpers/time_helper');

describe("tests checkRestaurantOpen", () => {
  let str = "Mon 5 am - 6 pm / Tues 10 am - 12:15 am / Weds 1:45 pm - 4:45 pm / Thurs 7:15 am - 3:45 am / Fri 1:30 pm - 12:45 am / Sat 11 am - 1 am / Sun 1:15 pm - 12:30 am";
  
  it("should compare invalid time string (string)", () => {
    expect(checkRestaurantOpen(str, "invalid time")).toBe(false);
  })
  it("should compare invalid time string (minutes > 59)", () => {
    expect(checkRestaurantOpen(str, "Mon 12:60 pm")).toBe(false);
  })
  it("should compare invalid time string (minutes < 0)", () => {
    expect(checkRestaurantOpen(str, "Mon 12:-1 pm")).toBe(false);
  })
  it("should compare invalid time string (hours > 12)", () => {
    expect(checkRestaurantOpen(str, "Mon 13 pm")).toBe(false);
  })
  it("should compare Tues 9 am", () => {
    expect(checkRestaurantOpen(str, "Tues 9 am")).toBe(false);
  })
  it("should compare Tues 10 am", () => {
    expect(checkRestaurantOpen(str, "Tues 10 am")).toBe(true);
  })
  it("should compare Tues 10:15 am", () => {
    expect(checkRestaurantOpen(str, "Tues 10:15 am")).toBe(true);
  })

  // layout of how this looks (for Sat-Mon, which are the trickiest ones
  /*__________________________________________________________________________________________________________________________________
                  sat          |                   sun                    |                          mon                            
    -------------------------12am---------------------------------------12am----------------------------------------------------------
      .              .         |         .           .         .          |        .     .          .         .         .    .     .
      .              .         |         .           .         .          |        .     .          .         .         .    .     .
      .  _____________________________   .           .         .          |        .     .    _______________________________      . 
      .  | 11am     sat hours    1am |   .           .         .          |        .     .    |5am        mon hours      6pm |     . 
      .  -----------------------------   .           .         .          |        .     .    -------------------------------      .
      .              .         |         .     ____________________________________      .          .         .         .    .     .
      .              .         |         .     | 1:15pm      sun hours     12:30am |     .          .         .         .    .     . 
      .              .         |         .     ------------------------------------      .          .         .         .    .     .
      .              .         |         .           .         .          |        .     .          .         .         .    .     .
      .              .         |         .           .         .          |        .     .          .         .         .    .     .
      .              .         |         .           .         .          |        .     .          .         .         .    .     .
    sat 10am      sat 12pm  sun 12am   sun 1pm    sun 4pm   sun 5pm    mon 12am    .   mon 2am   mon 7am   mon 12pm  mon 4pm .  mon 7pm
    (false)        (true)    (true)    (false)      (true)    (true)     (true)     .   (false)   (true)    (true)    (true)  .  (false)
      .                                                                        mon 12:30am                                  mon 6pm
      .                                                                          (true)                                    (true)
    */
  it("should compare Sat 10 am", () => {
    expect(checkRestaurantOpen(str, "Sat 10 am")).toBe(false);
  })
  it("should compare Sat 12 pm", () => {
    expect(checkRestaurantOpen(str, "Sat 12 pm")).toBe(true);
  })
  it("should compare Sun 12 am", () => {
    expect(checkRestaurantOpen(str, "Sun 12 am")).toBe(true);
  })
  it("should compare Sun 1 pm", () => { 
    expect(checkRestaurantOpen(str, "Sun 1 pm")).toBe(false);
  })
  it("should compare Sun 4 pm", () => {
    expect(checkRestaurantOpen(str, "Sun 4 pm")).toBe(true);
  })
  it("should compare Sun 5 pm", () => {
    expect(checkRestaurantOpen(str, "Sun 5 pm")).toBe(true);
  })
  it("should compare Mon 12 am", () => {
    expect(checkRestaurantOpen(str, "Mon 12 am")).toBe(true);
  })
  it("should compare Mon 12:30 am", () => {
    expect(checkRestaurantOpen(str, "Mon 12:30 am")).toBe(true);
  })
  it("should compare Mon 2 am", () => {
    expect(checkRestaurantOpen(str, "Mon 2 am")).toBe(false);
  })
  it("should compare Mon 7 am", () => {
    expect(checkRestaurantOpen(str, "Mon 7 am")).toBe(true);
  })
  it("should compare Mon 12 pm", () => {
    expect(checkRestaurantOpen(str, "Mon 12 pm")).toBe(true);
  })
  it("should compare Mon 4 pm", () => {
    expect(checkRestaurantOpen(str, "Mon 4 pm")).toBe(true);
  })
  it("should compare Mon 6 pm", () => {
    expect(checkRestaurantOpen(str, "Mon 6 pm")).toBe(true);
  })
  it("should compare Mon 7 m", () => {
    expect(checkRestaurantOpen(str, "Mon 7 pm")).toBe(false);
  })
})