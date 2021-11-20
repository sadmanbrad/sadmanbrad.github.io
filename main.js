 
const iOSChromeDetected = /CriOS/.test(navigator.userAgent);

if (iOSChromeDetected) {
  const getHeight = function getComputedHeightFrom(element) {
    const computedHeightString = getComputedStyle(element).height;
    const elementHeight = Number(computedHeightString.replace('px', ''));
    return elementHeight;
  };

  const calculateVh = function calculateVhFrom(elementHeight) {
    const approximateVh = (elementHeight / initialViewportHeight) * 100;
    const elementVh = Math.round(approximateVh);
    return elementVh;
  };

  const setDataAttribute = function setDataAttributeUsing(elementVh, element) {
    const dataAttributeValue = `${elementVh}`;
    element.setAttribute('data-vh', dataAttributeValue);
  };

  const setHeight = function setHeightBasedOnVh(element) {
    const landscape = orientation;
    const vhRatio = Number(element.dataset.vh / 100);
    if (landscape) {
      element.style.height = `${vhRatio * landscapeHeight}px`;
    } else {
      element.style.height = `${vhRatio * portraitHeight}px`;
    }
  };

  const initialize = function initializeDataAttributeAndHeight(element) {
    const elementHeight = getHeight(element);
    const elementVh = calculateVh(elementHeight);
    setDataAttribute(elementVh, element);
    setHeight(element);
  };

  const initialViewportHeight = window.innerHeight;
  const elements = Array.from(document.getElementsByClassName('vh-fix'));
  const statusBarHeight = 20;
  const portraitHeight = screen.height - statusBarHeight;
  const landscapeHeight = screen.width - statusBarHeight;

  window.onload = function() {
    window.addEventListener('orientationchange', function() {
      elements.forEach(setHeight);
    });

    elements.forEach(initialize);
  };
}

// DEMO

(function() {

  // Easing function used for `translateX` animation
  // From: https://gist.github.com/gre/1650294
  function easeOutQuad (t) {
    return t * (2 - t)
  }

  function easeOutExponential (x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  // Returns a random number (integer) between `min` and `max`
  function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function lerpClamp (min, max, t, tmin, tmax) {
    t = t > tmax ? tmax : ((tmin > t) ? tmin : t);
    return (t - tmin)/(tmax - tmin) * (max - min) + min;
  }

  function easeLerpClamp (min, max, t, tmin, tmax) {
    t = t > tmax ? tmax : ((tmin > t) ? tmin : t);
    t = (t - tmin)/(tmax - tmin);
    return easeOutQuad(t) * (max - min) + min;
  }

  // Returns a random number as well, but it could be negative also
  function randomPositiveOrNegative (min, max) {
    return random(min, max) * (Math.random() > 0.5 ? 1 : -1)
  }

  // Set CSS `tranform` property for an element
  function setTransform (el, transform) {
    el.style.transform = transform
    el.style.WebkitTransform = transform
  }

  // Current scroll position
  var current = 0
  // Target scroll position
  var target = 0
  // Ease or speed for moving from `current` to `target`
  var ease = 0.025
  // Utility variables for `requestAnimationFrame`
  var rafId = undefined
  var rafActive = false
  // Container element
  var container = document.querySelector('.container')
  var astroflag = document.querySelector('.astro-flag')
  var rocketship = document.querySelector('.rocket-ship')
  var mynameis = document.querySelector('.my-name-is')
  var planet = document.querySelector('.planet')
  var star = document.querySelector('.star')
  var broadcaster_wrapper = document.querySelector('.broadcaster-wrapper')
  var broadcaster = document.querySelector('#broadcaster')
  var spaced_out_wrapper = document.querySelector('#spaced_out')
  var linn = document.querySelector('#linn')
  var linn_wrapper = document.querySelector('.linn-wrapper')
  var red_estate_wrapper = document.querySelector('.red-estate-wrapper')
  var red_estate = document.querySelector('#the-red-estate')
  // Array with `.image` elements
  //var images = Array.prototype.slice.call(document.querySelectorAll('.image'))
  // Variables for storing dimmensions
  var windowWidth, containerHeight, imageHeight

  // Variables for specifying transform parameters and limits
  var rotateXMaxList = []
  var rotateYMaxList = []
  var translateXMax = -200

  // Popullating the `rotateXMaxList` and `rotateYMaxList` with random values

  // The `fakeScroll` is an element to make the page scrollable
  // Here we are creating it and appending it to the `body`
  const fakeScroll = document.createElement("div");
  fakeScroll.className = 'fake-scroll';
  //document.body.appendChild(fakeScroll);
  // In the `setupAnimation` function (below) we will set the `height` properly

  // Geeting dimmensions and setting up all for animation
  function setupAnimation () {
    // Updating dimmensions
    windowWidth = window.innerWidth
    containerHeight = container.getBoundingClientRect().height
    // Set `height` for the fake scroll element
    fakeScroll.style.height = containerHeight + 'px'
    // Start the animation, if it is not running already
    startAnimation()
  }

  // Update scroll `target`, and start the animation if it is not running already
  function updateScroll (e) {
    target = e;
    startAnimation()
  }

  // Start the animation, if it is not running already
  function startAnimation () {
    if (!rafActive) {
      rafActive = true
      rafId = requestAnimationFrame(updateAnimation)
    }
  }

  var animation_start_time = -1;
  var animation_start_target = 0;

  // Do calculations and apply CSS `transform`s accordingly
  function updateAnimation (timestamp) {
    console.log(timestamp, current);
    // Difference between `target` and `current` scroll position
    var diff = target - current
    // `delta` is the value for adding to the `current` scroll position
    // If `diff < 0.1`, make `delta = 0`, so the animation would not be endless

    if (Math.abs(diff) > 1) { // If `delta !== 0`
      // Update `current` scroll position
      if (animation_start_time === -1)
        animation_start_time = timestamp;
      current = easeLerpClamp(animation_start_target, target, timestamp, animation_start_time, animation_start_time + 2000)
      // Round value for better performance
      current = parseFloat(current.toFixed(2))
      // Call `update` again, using `requestAnimationFrame`
      rafId = requestAnimationFrame(updateAnimation)
    } else { // If `delta === 0`
      // Update `current`, and finish the animation loop
      current = target
      rafActive = false
      cancelAnimationFrame(rafId)
      animation_start_target = current;
      animation_start_time = -1;
    }

    // Update images
    updateAnimationImages()

    // Set the CSS `transform` corresponding to the custom scroll effect
    //setTransform(container, 'translateY('+ -current +'px)')
  }

  // Calculate the CSS `transform` values for each `image`, given the `current` scroll position
  function updateAnimationImages () {
    // This value is the `ratio` between `current` scroll position and image's `height`
    var ratio = current / imageHeight
    // Some variables for using in the loop
    var intersectionRatioIndex, intersectionRatioValue, intersectionRatio
    var rotateX, rotateXMax, rotateY, rotateYMax, translateX
    translateX = -current
    mynameis.style.opacity = lerpClamp(1, 0, current, 400, 1000);
    rect = planet.getBoundingClientRect();
    if (current <= 2200) {
      var scaleAmount = lerpClamp(1, 1.2, current, 0, 1000)
      setTransform(astroflag, 'translateY('+ -translateX +'px) translateX('+ translateX/2 +'px) scaleX('+scaleAmount+') scaleY('+scaleAmount+')')
      planet.style.width = 'calc(' + lerpClamp(20, 0, current, 400, 1800) +'em + '
                                  + lerpClamp(0, 100, current, 400, 1800) +'vw)';
      planet.style.height = 'calc(' + lerpClamp(20, 0, current, 400, 1800) +'em + '
                                  + lerpClamp(0, 100, current, 400, 1800) +'vw)';
      planet.style.bottom = 'calc(' + lerpClamp(25, 50, current, 400, 1800) + '% - '
                                + lerpClamp(20, 0, current, 400, 1800)/2 +'em - '
                                + lerpClamp(0, 100, current, 400, 1800)/2 +'vw)'
      planet.style.left = lerpClamp(70, 40, current, 400, 1800) +'%';
      rocketship.style.width = lerpClamp(10, 40, current, 0, 1800) +'em';
      rocketship.style.height = lerpClamp(10, 40, current, 0, 1800) +'em';
      rocketship.style.right = 'calc(' + lerpClamp(100, 60, current, 0, 1800) + '% - '
                                + lerpClamp(10, 40, current, 0, 1800)/2 +'em)';
      rocketship.style.top = 'calc(' + lerpClamp(100, 50, current, 0, 1800) +'% - ' 
                                + lerpClamp(10, 40, current, 0, 1800)/2 +'em)';
      setTransform(rocketship, 'rotate('+ lerpClamp(45, 70, current, 0, 1800) +'deg)');
      spaced_out_wrapper.style.opacity = 0;
    }

    if (current > 1800 && current <= 2400) {
      planet.style.left = lerpClamp(40, 10, current, 1800, 2400) +'%';
      rocketship.style.right = 'calc(' + lerpClamp(60, 90, current, 1800, 2400) + '% - 20em)';
      spaced_out_wrapper.style.opacity = lerpClamp(0, 1, current, 1800, 2400);
    }

    if (current > 2400 && current <= 3500) {
      planet.style.left = 'calc(' + lerpClamp(10, 0, current, 2400, 3300) + '% - ' 
                            + lerpClamp(0, 250, current, 2400, 3300) + 'em)';
      rocketship.style.right = 'calc(' + lerpClamp(90, 200, current, 2400, 3300) + '% - 20em)';
      spaced_out_wrapper.style.opacity = lerpClamp(1, 0, current, 2400, 3200);
      star.style.opacity = lerpClamp(0, 1, current, 2800, 3500);
      broadcaster.style.opacity = lerpClamp(0, 1, current, 2800, 3500);
      setTransform(star, 'translateY(0px)');
      setTransform(broadcaster_wrapper, 'translateY(0px)');
    }

    if (current > 3500 && current <= 4900) {
      setTransform(star, 'translateY('+ lerpClamp(0, -1600, current, 3500, 4500) +'px)');
      setTransform(broadcaster_wrapper, 'translateY('+ lerpClamp(0, -1600, current, 3500, 4500) +'px)');
      star.style.opacity = lerpClamp(1, 0, current, 3500, 4500);
      broadcaster.style.opacity = lerpClamp(1, 0, current, 3500, 4500);
      linn.style.opacity = lerpClamp(0, 1, current, 3500, 4500);
      setTransform(linn_wrapper, 'translateY('+ lerpClamp(2400, 0, current, 3500, 4500) +'px)' + ' translateX(-'+ lerpClamp(0, 100, current, 4500, 5200) +'%)');
      linn.style.opacity = lerpClamp(1, 0, current, 4500, 4900);
    }
    else {
      setTransform(linn_wrapper, 'translateY(2400px)');
    }

    if (current > 4500 && current <= 5800) {
      red_estate_wrapper.style.display = 'flex';
      red_estate_wrapper.style.opacity = lerpClamp(0, 1, current, 4500, 5200);
      if (current > 5200 && current <= 5300) 
        red_estate.style.opacity = 0.6;
      else if (current > 5300 && current <= 5400) 
        red_estate.style.opacity = 0;
      else if (current > 5400 && current <= 5500) 
        red_estate.style.opacity = 0.7;
      else if (current > 5500 && current <= 5550) 
        red_estate.style.opacity = 0;
      else if (current > 5550 && current <= 5600) 
        red_estate.style.opacity = 0.7;
      else if (current > 5600 && current <= 5650) 
        red_estate.style.opacity = 0;
      else if (current > 5650 && current <= 5800) 
        red_estate.style.opacity =  lerpClamp(0.7, 1, current, 5550, 5800);
    }
    else {
      red_estate_wrapper.style.display = 'none';
    }

    //planet.style.boxShadow = 'inset 0px 0px ' + lerpClamp(5, 20, current, 400, 2000) + 'em 0em rgba(255, 255, 255, 1), 0 0 '+lerpClamp(2, 2, current, 400, 2000)+'em 0em white'

    // // For each `image` element, make calculations and set CSS `transform` accordingly
    // images.forEach(function (image, index) {
    //   // Calculating the `intersectionRatio`, similar to the value provided by
    //   // the IntersectionObserver API
    //   intersectionRatioIndex = windowWidth > 760 ? parseInt(index / 2) : index
    //   intersectionRatioValue = ratio - intersectionRatioIndex
    //   intersectionRatio = Math.max(0, 1 - Math.abs(intersectionRatioValue))
    //   // Calculate the `rotateX` value for the current `image`
    //   rotateXMax = rotateXMaxList[index]
    //   rotateX = rotateXMax - (rotateXMax * intersectionRatio)
    //   rotateX = rotateX.toFixed(2)
    //   // Calculate the `rotateY` value for the current `image`
    //   rotateYMax = rotateYMaxList[index]
    //   rotateY = rotateYMax - (rotateYMax * intersectionRatio)
    //   rotateY = rotateY.toFixed(2)
    //   // Calculate the `translateX` value for the current `image`
    //   if (windowWidth > 760) {
    //     translateX = translateXMax - (translateXMax * easeOutQuad(intersectionRatio))
    //     translateX = translateX.toFixed(2)
    //   } else {
    //     translateX = 0
    //   }
    //   // Invert `rotateX` and `rotateY` values in case the image is below the center of the viewport
    //   // Also update `translateX` value, to achieve an alternating effect
    //   if (intersectionRatioValue < 0) {
    //     rotateX = -rotateX
    //     rotateY = -rotateY
    //     translateX = index % 2 ? -translateX : 0
    //   } else {
    //     translateX = index % 2 ? 0 : translateX
    //   }
    //   // Set the CSS `transform`, using calculated values
    //   setTransform(image, 'perspective(500px) translateX('+ translateX +'px) rotateX('+ rotateX +'deg) rotateY('+ rotateY +'deg)')
    // })
  }

  // Listen for `resize` event to recalculate dimmensions
  
  // Listen for `scroll` event to update `target` scroll position
  // window.addEventListener('wheel', updateScroll)
  $('.scroll-catcher').scroll(function (event) {
    amount = $('.scroll-catcher').scrollTop();
    updateScroll(amount);
  });

  var array_of_functions = [
    goto_planet,
    goto_broadcaster,
    goto_linn,
    goto_red_estate
  ];
  var current_pos_index = 0;

  function goto_planet() {
    updateScroll(2400);
    $('#progress-goto-planet').addClass('current');
    $('#progress-goto-broadcaster').removeClass('current');
    $('#progress-goto-linn').removeClass('current');
    $('#progress-goto-red-estate').removeClass('current');
    current_pos_index = 0;
    animation_start_target = current;
    animation_start_time = -1;
  }

  function goto_broadcaster() {
    updateScroll(3500);
    $('#goto-planet').fadeOut();
    $('#progress-goto-planet').removeClass('current');
    $('#progress-goto-broadcaster').addClass('current');
    $('#progress-goto-linn').removeClass('current');
    $('#progress-goto-red-estate').removeClass('current');
    current_pos_index = 1;
    animation_start_target = current;
    animation_start_time = -1;
  }

  function goto_linn() {
    updateScroll(4500);
    $('#goto-planet').fadeOut();
    $('#progress-goto-planet').removeClass('current');
    $('#progress-goto-broadcaster').removeClass('current');
    $('#progress-goto-linn').addClass('current');
    $('#progress-goto-red-estate').removeClass('current');
    current_pos_index = 2;
    animation_start_target = current;
    animation_start_time = -1;
  }

  function goto_red_estate() {
    updateScroll(5800);
    $('#goto-planet').fadeOut();
    $('#progress-goto-planet').removeClass('current');
    $('#progress-goto-broadcaster').removeClass('current');
    $('#progress-goto-linn').removeClass('current');
    $('#progress-goto-red-estate').addClass('current');
    current_pos_index = 3;
    animation_start_target = current;
    animation_start_time = -1;
  }

  $('#goto-planet').click(function (event) {
    $('.top-bar').fadeIn();
    $('#goto-planet').fadeOut();
    goto_planet();
  });

  $('#back').click(function (event) {
    updateScroll(0);
    $('#goto-planet').delay(600).fadeIn();
    $('.top-bar').fadeOut();
  });


  $('#goto-broadcaster').click(function (event) {
    goto_broadcaster();
    $('.top-bar').fadeIn();
  });


  $('#goto-linn').click(function (event) {
    goto_linn();
    $('.top-bar').fadeIn();
  });

  $('#goto-red-estate').click(function (event) {
    goto_red_estate();
    $('.top-bar').fadeIn();
  });


  $('#progress-goto-planet').click(function (event) {
    goto_planet();
  });

  $('#progress-goto-broadcaster').click(function (event) {
    goto_broadcaster();
  });

  $('#progress-goto-linn').click(function (event) {
    goto_linn();
  });

  $('#progress-goto-red-estate').click(function (event) {
    goto_red_estate();
  });

  $('#next').click(function (event) {
    if (current_pos_index < 3) {
      current_pos_index += 1;
      array_of_functions[current_pos_index]();
    }

  });

  $('#prev').click(function (event) {
    if (current_pos_index > 0) {
      current_pos_index -= 1;
      array_of_functions[current_pos_index]();
    }
  });

  // Initial setup
  setupAnimation()

})()

function rescale() {
  console.log('rescale called');
  const scaleSize = Math.min($(window).width()/3840, $(window).height()/1800);
  $('.container').css({
    '-webkit-transform' : 'scale(' + scaleSize + ')',
    '-moz-transform'    : 'scale(' + scaleSize + ')',
    '-ms-transform'     : 'scale(' + scaleSize + ')',
    '-o-transform'      : 'scale(' + scaleSize + ')',
    'transform'         : 'scale(' + scaleSize + ')'
  });
}

// $(document).ready(rescale);

// $(window).resize(rescale);

// (function() {
//   var supportOffset = window.pageYOffset !== undefined,
//     lastKnownPos = 0,
//     ticking = false,
//     scrollDir,
//     currYPos;

//   function doSomething(scrollPos, scrollDir) {
//     // Your code goes here...
//     console.log('scroll pos: ' + scrollPos + ' | scroll dir: ' + scrollDir);
//   }

//   window.addEventListener('wheel', function(e) {
//     currYPos = supportOffset ? window.pageYOffset : document.body.scrollTop;
//     scrollDir = lastKnownPos > currYPos ? 'up' : 'down';
//     lastKnownPos = currYPos;

//     if (!ticking) {
//       window.requestAnimationFrame(function() {
//         doSomething(lastKnownPos, scrollDir);
//         ticking = false;
//       });
//     }
//     ticking = true;
//   });
// })();