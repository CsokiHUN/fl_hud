const hudElements = {
  health: {
    color: 'rgba(210, 77, 87)',
    bg_color: 'rgba(210, 77, 87, 0.5)',
    blinking: false,
  },

  armor: {
    color: 'rgb(74, 158, 222)',
    bg_color: 'rgba(74, 158, 222, 0.5)',
    blinking: false,
  },

  hunger: {
    color: 'rgb(182, 167, 64)',
    bg_color: 'rgba(182, 167, 64, 0.5)',
    blinking: true,
  },

  thirst: {
    color: 'rgb(102, 204, 255)',
    bg_color: 'rgba(102, 204, 255, 0.5)',
    blinking: true,
  },

  stamina: {
    color: 'rgb(220, 220, 220)',
    bg_color: 'rgba(220, 220, 220, 0.5)',
    blinking: true,
  },
};

const Main = document.querySelector('.main');

Object.entries(hudElements).forEach((elem) => {
  const [name, value] = elem;

  $('#' + name).circleProgress({
    value: 1,
    size: 200,
    thickness: (name == 'health' && 10) || 24,
    animation: false,
    fill: value.color,
    startAngle: -Math.PI / 2,
    emptyFill: value.bg_color || 'rgba(20, 20, 20, .5)',
  });
});

window.addEventListener('message', ({ data }) => {
  if (data.mugshot != undefined) {
    const elem = Main.querySelector('.character');
    elem.style.backgroundImage = `url('https://nui-img/${data.mugshot}/${data.mugshot}')`;
    return;
  }

  if (data.visible != undefined) {
    Main.style.display = (data.visible && 'flex') || 'none';
  }

  if (data.serverId != undefined) {
    Main.querySelector('#id').innerText = data.serverId;
  }

  Object.entries(data).forEach((elem) => {
    const [name, value] = elem;

    if (hudElements[name]) {
      $('#' + name).circleProgress({
        value: value / 100,
      });

      if (hudElements[name].blinking) {
        const elem = Main.querySelector('#' + name);
        if (value < 25) {
          elem.classList.add(
            'animate__animated',
            'animate__pulse',
            'animate__infinite'
          );
        } else {
          elem.classList.remove(
            'animate__animated',
            'animate__pulse',
            'animate__infinite'
          );
        }
      }
    }
  });

  // if (data.hunger != undefined) {
  //   if (!hudElements.hunger.value ||)

  //   $('#hunger').circleProgress({
  //     value: data.hunger / 100,
  //   });
  // }
});
