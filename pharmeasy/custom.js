let utm = {};
let type = "web";

function getUtmDetails() {
  var self = window.location.toString();
  var querystring = self.split("?");
  if (querystring.length > 1) {
    var pairs = querystring[1].split("&");
    for (var i in pairs) {
      var keyval = pairs[i].split("=");
      sessionStorage.setItem(keyval[0], decodeURIComponent(keyval[1]));
    }
  }
  var source = sessionStorage.getItem("utm_source") || "";
  var medium = sessionStorage.getItem("utm_medium") || "";
  var campaign = sessionStorage.getItem("utm_campaign") || "";
  var gclid = sessionStorage.getItem("gclid") || "";
  var fbclid = sessionStorage.getItem("fbclid") || "";
  var mx_adclick_id =
    sessionStorage.getItem("mx_adclick_id") || gclid + "/" + fbclid;

  return {
    Source: source,
    SourceMedium: medium,
    SourceCampaign: campaign,
    mx_adclick_id: mx_adclick_id,
  };
}
utm = getUtmDetails();

const track = (action, data, type) => {
  const t = type || "web";

  cleverTapID = clevertap.getCleverTapID();
  console.log("clevertap id", cleverTapID);

  if (t == "web") {
    data.page_name = "p_surgicare_surgery_marketing";
    data.session_id = getSessionId();
    data.page_load_id = uuidv4();
    data.mx_adClick_id = utm.mx_adclick_id;
    data.utm_source = utm.Source;
    data.utm_medium = utm.SourceMedium;
    data.utm_campaign = utm.SourceCampaign;
    clevertap.event.push(action, data);
  } else {
  }
  console.log("event tracked:", action, data);
};

window.onload = function () {
  const data = {
    surgery_name: window.speciality || "Home",
    city_name: window.city || "Home",
  };
  track("page_load", data, type);
};

function amountscrolled() {
  var winheight = $(window).height();
  var docheight = $(document).height();
  var scrollTop = $(window).scrollTop();
  var trackLength = docheight - winheight;
  var pctScrolled = Math.floor((scrollTop / trackLength) * 100) + 1; // gets percentage scrolled (ie: 80 NaN if tracklength == 0)
  if (pctScrolled % 25 == 0) {
    console.log(pctScrolled + "% scrolled");
    const data = {
      event_category: "Scroll",
      event_label: "Scroll",
      event_action: "Scroll",
      percentage: pctScrolled,
    };
    gtag_report_sendTo(data, "UA-60621013-31");
  }
}

window.onscroll = function () {
  myFunction();
  amountscrolled();
};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
}

$(".carousel").carousel({
  interval: 2000,
});

$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    autoplay: 3000,
    smartSpeed: 1000,
    responsive: {
      0: {
        items: 2,
        nav: true,
      },
      600: {
        items: 3,
        nav: true,
      },
      1000: {
        items: 5,
        nav: true,
        loop: true,
        margin: 20,
      },
    },
  });
});

$("#owl-demo").owlCarousel({
  loop: true,
  margin: 10,
  responsiveClass: true,
  autoplay: true,
  autoplayTimeout: 6000,
  autoplayHoverPause: true,
  autoplay: 3000,
  smartSpeed: 1000,
  responsive: {
    0: {
      items: 1,
      nav: true,
    },
    600: {
      items: 3,
      nav: true,
    },
    1000: {
      items: 3,
      nav: true,
      loop: true,
      margin: 20,
    },
  },
});

function gtag_report_sendTo(data, send_to) {
  data["send_to"] = send_to;
  gtag("event", data.event_action, data);
  console.log("GA event: ", data);
  return false;
}

function objfilter(data, keys_to_keep) {
  return Object.fromEntries(
    Object.entries(data).filter((a) => keys_to_keep.includes(a[0]))
  );
}

$(document).ready(function () {
  $(".submitrequest")
    .unbind("click")
    .click(function () {
      let form = $(this).parents("form");
      var city = $(".submitrequest").data("city");
      var specialty = $(".submitrequest").data("specialty");
      const eventData = {
        surgery_name: specialty,
        city_name: city,
        property_section_name: "body",
        property_name: "lead_form",
        property_cta: "button",
        action_type: "click",
      };
      eventData["custom_column1_name"] = "lead_submission_data";
      const keys_to_keep = ["phoneno", "fullname", "email"];
      const arr = Object.fromEntries(
        new FormData(document.getElementById("submit_form"))
      );
      filter = objfilter(arr, keys_to_keep);
      eventData["custom_column1_value"] = JSON.stringify(filter);
      const data = {
        event_category: "Conversions",
        event_action: "Lead Submission",
        event_label: "Lead-form",
        surgery_name: specialty,
        city_name: city,
      };
      if (!form.valid()) {
        return form.validate().form();
      }
      var phone_no = $("#phoneno").val();
      var filter = /^\d*(?:\.\d{1,2})?$/;
      if (filter.test(phone_no)) {
        if (phone_no.length == 10) {
          // $('#error_phone_no').html('Valid Number');
          // $('#error_phone_no').css('color',"green");
          $.ajax({
            url: "/lp/form-post.php",
            type: "POST",
            data: new FormData(document.getElementById("submit_form")),
            processData: false,
            contentType: false,
            success: function (res) {
              // let json = JSON.parse(res);
              // console.log(json);
              // if (res.Status == "Success") {
              $("#submit_form")[0].reset();
              $("#error_phone_no").html("");
              $("#thankyou").prepend(
                '<img src="https://dnectar.gotrackier.com/pixel?av=603de8842127982b5b55b6a8&txn_id=ORDER_ID_OR_TRANS_ID" style="visibility:hidden">'
              );
              $("#thankyou").prepend(
                '<img src="https://tracking.adcanopus.com/aff_l?offer_id=36690&adv_sub=SUB_ID" width="1" height="1" />'
              );
              $("#thankyou").prepend(
                '<iframe src="https://trk.digiadtec.com/pixel?adid=623dbce2783ab10aa4272188" scrolling="no" frameborder="0" width="1" height="1"></iframe>'
              );
              $("#thankyou").modal("show");
              fbq("track", "Lead");
              gtag_report_sendTo(data, "AW-10837729995/gyWCCO3D-JEDEMvF6q8o");
              // gtag_report_sendTo(data, 'UA-60621013-31');
              // }
            },
            error: function (jqXHR, exception) {
              var msg = "";
              if (jqXHR.status === 0) {
                msg = "Not connect.\n Verify Network.";
              } else if (jqXHR.status == 404) {
                msg = "Requested page not found. [404]";
              } else if (jqXHR.status == 500) {
                msg = "Internal Server Error [500].";
              } else if (exception === "parsererror") {
                msg = "Requested JSON parse failed.";
              } else if (exception === "timeout") {
                msg = "Time out error.";
              } else if (exception === "abort") {
                msg = "Ajax request aborted.";
              } else {
                msg = "Uncaught Error.\n" + jqXHR.responseText;
              }
              console.log("Errored-------", msg);
              $("#show_error1").html("Errored out");
              $("#show_error1").css("color", "red");
              $("#show_error1").css("font-size", "13px");
            },
          });
          track("interaction", eventData, type);
        } else {
          $("#error_phone_no").html("Enter Valid Number");
          $("#error_phone_no").css("color", "red");
        }
      }
    });
});

// for second form

$(document).ready(function () {
  $(".book-now-cta").click(function () {
    var city = $(".submitrequest2").data("city") || "Home";
    var specialty = $(".submitrequest2").data("specialty") || "Home";
    const data = {
      surgery_name: specialty,
      city_name: city,
      event_action: "Click to Open LF",
      event_category: "Conversions",
      event_label: "Open LF",
    };
    // gtag_report_sendTo(data, "AW-10837729995/gyWCCO3D-JEDEMvF6q8o");
  });
  $(".submitrequest2")
    .unbind("click")
    .click(function () {
      let form = $(this).parents("form");
      var city = $(".submitrequest2").data("city");
      var specialty = $(".submitrequest2").data("specialty");
      const eventData = {
        surgery_name: specialty,
        city_name: city,
        property_section_name: "book_consultation",
        property_name: "lead_form",
        property_cta: "button",
        action_type: "click",
      };
      eventData["custom_column1_name"] = "lead_submission_data";
      const keys_to_keep = ["phoneno", "fullname", "email"];
      const arr = Object.fromEntries(
        new FormData(document.getElementById("submit_form2"))
      );
      filter = objfilter(arr, keys_to_keep);
      eventData["custom_column1_value"] = JSON.stringify(filter);
      const data = {
        event_category: "Conversions",
        event_action: "Lead Submission",
        event_label: "Submit LF",
        surgery_name: specialty,
        city_name: city,
      };
      if (!form.valid()) {
        return form.validate().form();
      }
      var phone_no = $("#phoneno2").val();
      var filter = /^\d*(?:\.\d{1,2})?$/;
      if (filter.test(phone_no)) {
        if (phone_no.length == 10) {
          // $('#error_phone_no2').html('Valid Number');
          // $('#error_phone_no2').css('color',"green");
          $.ajax({
            url: "/lp/form-post.php",
            type: "POST",
            data: new FormData(document.getElementById("submit_form2")),
            processData: false,
            contentType: false,
            success: function (res) {
              // let json = JSON.parse(res);
              // console.log(json);
              // if (res.Status == "Success") {
              $("#submit_form2")[0].reset();
              $("#error_phone_no2").html("");
              $("#ctaform").modal("hide");
              $("#thankyou").prepend(
                '<img src="https://dnectar.gotrackier.com/pixel?av=603de8842127982b5b55b6a8&txn_id=ORDER_ID_OR_TRANS_ID" style="visibility:hidden">'
              );
              $("#thankyou").prepend(
                '<img src="https://tracking.adcanopus.com/aff_l?offer_id=36690&adv_sub=SUB_ID" width="1" height="1" />'
              );
              $("#thankyou").prepend(
                '<iframe src="https://trk.digiadtec.com/pixel?adid=623dbce2783ab10aa4272188" scrolling="no" frameborder="0" width="1" height="1"></iframe>'
              );
              $("#thankyou").modal("show");
              fbq("track", "Lead");
              gtag_report_sendTo(data, "AW-10837729995/gyWCCO3D-JEDEMvF6q8o");
              // gtag_report_sendTo(data, 'UA-60621013-31');
            },
            error: function (jqXHR, exception) {
              var msg = "";
              if (jqXHR.status === 0) {
                msg = "Not connect.\n Verify Network.";
              } else if (jqXHR.status == 404) {
                msg = "Requested page not found. [404]";
              } else if (jqXHR.status == 500) {
                msg = "Internal Server Error [500].";
              } else if (exception === "parsererror") {
                msg = "Requested JSON parse failed.";
              } else if (exception === "timeout") {
                msg = "Time out error.";
              } else if (exception === "abort") {
                msg = "Ajax request aborted.";
              } else {
                msg = "Uncaught Error.\n" + jqXHR.responseText;
              }
              console.log("Errored-------", msg);
              $("#show_error1").html("Errored out");
              $("#show_error1").css("color", "red");
              $("#show_error1").css("font-size", "13px");
            },
          });
          track("interaction", eventData, type);
        } else {
          $("#error_phone_no2").html("Enter Valid Number");
          $("#error_phone_no2").css("color", "red");
        }
      }
    });
});

$(".mob-cta").click(function () {
  var specialty = $(".mob-cta").data("specialty");
  var city = $(".mob-cta").data("city");
  var phone = $(".mob-cta").data("phone");
  var conversion = $(".mob-cta").data("conversion");
  console.log(conversion);
  const eventData = {
    surgery_name: specialty,
    city_name: city,
    property_section_name: "primary_nav",
    property_name: "call_us",
    property_cta: "button",
    action_type: "click",
  };
  fbq("track", "Contact");
  track("interaction", eventData, type);
  const data = {
    event_category: "Conversions",
    event_action: "Call Button Click",
    event_label: "mob-cta",
    surgery_name: specialty,
    city_name: city,
    phone_conversion_number: phone.toString(),
  };
  gtag("config", conversion, {
    phone_conversion_number: phone.toString(),
  });
  gtag_report_sendTo(data, conversion);
});

$(".faqClickTrack").click(function () {
  var city = $("div.faqClickTrack").data("city");
  var specialty = $("div.faqClickTrack").data("specialty");
  const eventData = {
    surgery_name: specialty,
    city_name: city,
    property_section_name: "body",
    property_name: "FAQ",
    property_cta: "faq_ellipses",
    action_type: "click",
  };
  track("interaction", eventData, type);
});

$(".doctorsProfile").click(function () {
  $(".doctors-cta").click(function () {
    var specialty = $(".doctors-cta").data("specialty");
    var city = $(".doctors-cta").data("city");
    const eventData = {
      surgery_name: specialty,
      city_name: city,
      property_section_name: "doctors_profile",
      property_name: "lead_form",
      property_cta: "button",
      action_type: "click",
    };
    track("interaction", eventData, type);
    return;
  });
  var specialty = $(".doctorsProfile").data("specialty");
  var city = $(".doctorsProfile").data("city");
  const eventData = {
    surgery_name: specialty,
    city_name: city,
    property_section_name: "body",
    property_name: "doctors_profile",
    property_cta: "button",
    action_type: "click",
  };
  track("interaction", eventData, type);
});

$(".our-customers").click(function () {
  var specialty = $(".our-customers").data("specialty");
  var city = $(".our-customers").data("city");
  const eventData = {
    surgery_name: specialty,
    city_name: city,
    property_section_name: "body",
    property_name: "customer_testimonial",
    property_cta: "button",
    action_type: "click",
  };
  track("interaction", eventData, type);
});

$(".surgeryDetails").click(function () {
  var specialty = $(".surgeryDetails").data("specialty");
  var city = $(".surgeryDetails").data("city");
  const eventData = {
    surgery_name: specialty,
    city_name: city,
    property_section_name: "body",
    property_name: "surgery_details",
    property_cta: "button",
    action_type: "click",
  };
  track("interaction", eventData, type);
});

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function generateSessionId() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
function setCookie(name, value) {
  let date = new Date();
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getSessionId() {
  let x_session_id = getCookie("session_id");
  let x_last_time_stamp = getCookie("last_time_stamp");
  x_last_time_stamp = new Date(parseInt(x_last_time_stamp));
  let last_time = x_last_time_stamp.getTime();
  let currentTime = parseInt(new Date().getTime());
  let currentDate = new Date().getDate();
  let last_date = x_last_time_stamp.getDate();
  if (
    x_session_id == null ||
    currentTime - last_time > 1800000 ||
    last_date != currentDate
  ) {
    // 30 min = 1800000ms
    //generate new session_id
    x_session_id = generateSessionId();
    x_last_time_stamp = new Date().getTime();
    setCookie("session_id", x_session_id);
    setCookie("last_time_stamp", x_last_time_stamp);
  } else {
    x_last_time_stamp = new Date().getTime();
    setCookie("last_time_stamp", x_last_time_stamp);
  }
  return x_session_id;
}