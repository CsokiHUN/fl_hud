let mug = false;

function modelLoadedAsync() {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      const ped = PlayerPedId();
      const model = GetEntityModel(ped);

      if (model && HasModelLoaded(model)) {
        resolve(ped);
        clearInterval(timer);
      }
    }, 100);
  });
}

async function getMugshot() {
  const ped = await modelLoadedAsync();

  mug = RegisterPedheadshotTransparent(ped);

  const timer = setInterval(() => {
    if (!IsPedheadshotValid(mug)) {
      UnregisterPedheadshot(mug);

      mug = RegisterPedheadshotTransparent(ped);
    } else {
      if (IsPedheadshotReady(mug)) {
        SendNUIMessage({
          mugshot: GetPedheadshotTxdString(mug),
        });
        UnregisterPedheadshot(mug);
        clearInterval(timer);
      }
    }
  }, 100);
}

function resourceStart() {
  getMugshot();
  SendNUIMessage({
    serverId: GetPlayerServerId(PlayerId()),
  });
}
setTimeout(resourceStart, 2000);

onNet('playerSpawned', () => {
  setTimeout(resourceStart, 2000);
});

on('onClientResourceStop', (resourceName) => {
  if (GetCurrentResourceName() != resourceName) {
    return;
  }
  if (mug) UnregisterPedheadshot(mug);
});

setInterval(async () => {
  const ped = PlayerPedId();
  const playerId = PlayerId();

  SendNUIMessage({
    visible: !IsPauseMenuActive(),
    health: GetEntityHealth(ped) - (GetEntityMaxHealth(ped) === 175 ? 75 : 100),
    armor: GetPedArmour(ped),
    stamina: 100 - GetPlayerSprintStaminaRemaining(playerId),
  });
}, 100);

setInterval(async () => {
  const hunger = await getStatus('hunger');
  const thirst = await getStatus('thirst');

  SendNUIMessage({
    hunger,
    thirst,
  });
}, 1000);

function getStatus(name = 'hunger') {
  return new Promise((resolve) => {
    emit('esx_status:getStatus', name, (status) => {
      resolve(status.getPercent());
    });
  });
}
