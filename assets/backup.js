function dist(e, rq) {
  if (rq >= 1) {
    let coords = {
      x0: e.touches[0].clientX,
      y0: e.touches[0].clientY,
      x1: e.touches[1].clientX,
      y1: e.touches[1].clientY,
    };

    coords.x = (coords.x0 + coords.x1) / 2;
    coords.y = (coords.y0 + coords.y1) / 2;
    coords.z = Math.hypot(
      Math.abs(coords.x0 - coords.x1),
      Math.abs(coords.y0 - coords.y1)
    );

    if (rq === 1) {
      coords.offsetX =
        (coords.x - bb.newCoords.x - bb.newCoords.w / 2) / bb.newCoords.zoom;
      coords.offsetY =
        (coords.y - bb.newCoords.y - bb.newCoords.h / 2) / bb.newCoords.zoom;
    }

    return coords;
  } else {
    return {
      x: e.type.indexOf('touch') > -1 ? e.touches[0].clientX : e.clientX,
      y: e.type.indexOf('touch') > -1 ? e.touches[0].clientY : e.clientY,
    };
  }
}
function gestureStart(e) {
  if ((e.type === 'mousedown' && e.button != 0) || !vbb.slidesNo) return;
  if (!currContent.contains(e.target) && !e.target.closest('.caption')) return;

  // save gesture time start to know gesture duration
  bb.gT = new Date().getTime();
  bb.maybeCaption = e.target.closest('.caption');

  if (!e.target.closest('.caption.full-text')) {
    if (vbb.playing) {
      stopSlideshow();
      vbb.playing = true;
    }

    // allow doubleTap to zoom only on image content.
    if (currSlide.getAttribute('data-cont-type') === 'image') {
      e.preventDefault();
      // DoubleTab Function Luncher
      if (e.type === 'touchstart') {
        bb.touchGT = new Date().getTime();
        var tapLength = bb.touchGT - bb.doubleTap;
      } else {
        bb.mouseGT = new Date().getTime();
        var tapLength = bb.mouseGT - bb.doubleTap;
      }

      if (
        tapLength < 300 &&
        tapLength > 100 &&
        !(e.type === 'touchstart' && e.touches.length > 1)
      ) {
        if (bb.newCoords.zoom === 1) {
          let pointerCoords = dist(e);
          let rect = currSlide.getBoundingClientRect();
          let cursorX =
            pointerCoords.x - rect.left - currContent.clientWidth / 2;
          let cursorY =
            pointerCoords.y - rect.top - currContent.clientHeight / 2;
          let xs = cursorX - bb.newCoords.x;
          let ys = cursorY - bb.newCoords.y;

          bb.newCoords.zoom = 2;
          bb.newCoords.x = cursorX - xs * bb.newCoords.zoom;
          bb.newCoords.y = cursorY - ys * bb.newCoords.zoom;
          [...toolbar.value.querySelectorAll(':scope .item.zoom-out')].forEach(
            (el) => el.classList.remove('disabled')
          );
          currContent.style.transform = `translate(${bb.newCoords.x}px, ${bb.newCoords.y}px) scale(${bb.newCoords.zoom})`;
          clearTimeout(bb.readjustTimeout);
          bb.readjustTimeout = setTimeout(() => reAdjustSlide(), 350);
        } else {
          (bb.newCoords.x = 0), (bb.newCoords.y = 0), (bb.newCoords.zoom = 1);
          currContent.removeAttribute('style');
          [...toolbar.value.querySelectorAll(':scope .item.zoom-out')].forEach(
            (el) => el.classList.add('disabled')
          );
        }

        resizeIframe();
        bb.doubleTap = 0;
        bb.maybeCaption = false;
        bb.captionTogglePrevented = false;
        return;
      }

      bb.doubleTap = e.type === 'touchstart' ? bb.touchGT : bb.mouseGT;
    }

    // save the initial value of bb.newCoords to have it accessable when the move-gesture event is triggered. (That's because the bb.newCoords value might change during the event)
    bb.initCoords = {
      x: bb.newCoords.x,
      y: bb.newCoords.y,
      zoom: bb.newCoords.zoom,
    };
    //Zooming with pinch
    if (e.type === 'touchstart' && e.touches.length === 2) {
      e.preventDefault();
      currContent.classList.add('zooming');
      bb.newCoords.w = currContent.clientWidth;
      bb.newCoords.h = currContent.clientHeight;
      bb.startCoords = dist(e, 1);
      bb.doubleTap = 0; // stop double tap function to avoid it triggering after zoom pinch and a tap
    } else {
      bb.startCoords = dist(e);
      // Swiping
      if (bb.newCoords.zoom === 1) {
        bb.newCoords.w = slider.value.getBoundingClientRect().width;
        slider.value.classList.add('swiping');
      }
      //Zoom dragging
      else currContent.classList.add('zoom-dragging');
    }
  } else if (bb.maybeCaption) e.stopPropagation();

  if (e.type === 'touchstart') {
    document.addEventListener('touchmove', gestureMove);
    document.addEventListener('touchend', gestureEnd);
  } else if (e.type === 'mousedown') {
    document.addEventListener('mousemove', gestureMove);
    document.addEventListener('mouseup', gestureEnd);
  }
}
function gestureMove(e) {
  bb.moveDir =
    bb.endCoords.x > dist(e).x
      ? 1
      : bb.endCoords.x < dist(e).x
      ? -1
      : bb.moveDir;
  bb.endCoords = dist(e);
  if (
    Math.abs(bb.endCoords.x - bb.startCoords.x) > 5 ||
    Math.abs(bb.endCoords.y - bb.startCoords.y) > 5
  )
    bb.newCoords.change = true;

  // Pinch Zooming in action
  if (
    e.type === 'touchmove' &&
    e.touches.length === 2 &&
    currContent.classList.contains('zooming')
  ) {
    bb.endCoords = dist(e, 1);
    bb.newCoords.zoom =
      (bb.endCoords.z / bb.startCoords.z) * bb.initCoords.zoom;

    bb.endCoords.zx =
      (bb.initCoords.zoom - bb.newCoords.zoom) * bb.startCoords.offsetX;
    bb.endCoords.zy =
      (bb.initCoords.zoom - bb.newCoords.zoom) * bb.startCoords.offsetY;
    bb.endCoords.tx = bb.endCoords.zx + bb.endCoords.x - bb.startCoords.x;
    bb.endCoords.ty = bb.endCoords.zy + bb.endCoords.y - bb.startCoords.y;

    // the new offset is the old/current one plus the total translation component
    bb.newCoords.x = bb.initCoords.x + bb.endCoords.tx;
    bb.newCoords.y = bb.initCoords.y + bb.endCoords.ty;
    currContent.style.transform = `translate(${bb.newCoords.x}px, ${bb.newCoords.y}px) scale(${bb.newCoords.zoom})`;
  } else if (
    (currContent.classList.contains('zoom-dragging') ||
      slider.value.classList.contains('swiping')) &&
    bb.newCoords.change
  ) {
    bb.doubleTap = 0; // stop double-tap initialization
    bb.newCoords.x = bb.initCoords.x + bb.endCoords.x - bb.startCoords.x;
    bb.newCoords.y = bb.initCoords.y + bb.endCoords.y - bb.startCoords.y;
    bb.newCoords.change = true;

    // Swipping in action
    if (bb.newCoords.zoom === 1) {
      currSlide.style.transform = `translate(${bb.newCoords.x}px, 0px)`;
      if (bb.newCoords.x > 0) {
        if (prevSlide)
          prevSlide.style.transform = `translate(${
            bb.newCoords.x - bb.newCoords.w
          }px, 0px)`;
      } else if (nextSlide)
        nextSlide.style.transform = `translate(${
          bb.newCoords.x + bb.newCoords.w
        }px, 0px)`;
    }
    // Zoom-dragging in action
    else
      currContent.style.transform = `translate(${bb.newCoords.x}px, ${bb.newCoords.y}px) scale(${bb.newCoords.zoom})`;
  } else if (bb.maybeCaption && e.type === 'touchmove' && bb.newCoords.change)
    bb.captionTogglePrevented = true;
}
function gestureEnd(e) {
  if (e.type === 'touchend') {
    document.removeEventListener('touchmove', gestureMove);
    document.removeEventListener('touchend', gestureEnd);
  } else {
    document.removeEventListener('mousemove', gestureMove);
    document.removeEventListener('mouseup', gestureEnd);
  }

  if (currContent.classList.contains('zooming')) {
    currContent.classList.remove('zooming');
    stopSlideshow();

    if (bb.newCoords.change) {
      if (bb.newCoords.zoom <= 1) {
        (bb.newCoords.x = 0), (bb.newCoords.y = 0), (bb.newCoords.zoom = 1);
        currContent.removeAttribute('style');
        [...toolbar.value.querySelectorAll(':scope .item.zoom-out')].forEach(
          (el) => el.classList.add('disabled')
        );
      } else {
        [...toolbar.value.querySelectorAll(':scope .item.zoom-out')].forEach(
          (el) => el.classList.remove('disabled')
        );
        reAdjustSlide();
      }
    }
  } else if (currContent.classList.contains('zoom-dragging')) {
    currContent.classList.remove('zoom-dragging');
    stopSlideshow();
    if (bb.newCoords.change) reAdjustSlide();
  } else if (slider.value.classList.contains('swiping')) {
    slider.value.classList.remove('swiping');
    if (bb.maybeCaption)
      currSlide.querySelector(':scope .caption').classList.toggle('full-text');
    else
      currSlide.querySelector(':scope .caption')?.classList.remove('full-text');

    let changeExt = bb.endCoords.x - bb.startCoords.x;

    if (
      ((bb.newCoords.change &&
        Math.abs(changeExt) > currSlide.clientWidth / 20) ||
        (Math.abs(changeExt) > currSlide.clientHeight / 20 &&
          new Date().getTime() - bb.gT < 300)) &&
      ((bb.newCoords.x < 0 && bb.moveDir === 1) ||
        (bb.newCoords.x > 0 && bb.moveDir === -1))
    ) {
      if (bb.newCoords.x < 0) {
        update(vbb.currSlideNo + 1);
        if (vbb.playing) {
          stopSlideshow();
          startSlideshow();
        }
      } else if (bb.newCoords.x > 0) {
        update(vbb.currSlideNo - 1);
        stopSlideshow();
      }
    } else {
      update();
      stopSlideshow();
    }
  } else if (bb.maybeCaption && !bb.captionTogglePrevented)
    currSlide.querySelector(':scope .caption')?.classList.toggle('full-text');

  bb.maybeCaption = false;
  bb.captionTogglePrevented = false;
  slider.value.classList.remove('swiping'); // Do this to ensure the swiping class is removed if added by event emulation
  clearTimeout(bb.doubleTapTimeout);
  bb.doubleTapTimeout = setTimeout(() => (bb.doubleTap = 0), 300);
  bb.newCoords.change = false;
}