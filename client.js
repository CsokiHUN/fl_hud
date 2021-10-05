let mug = false;

function getMugshot() {
  const ped = PlayerPedId();
  mug = RegisterPedheadshotTransparent(ped);

  setTimeout(() => {
    console.log(IsPedheadshotReady(mug), IsPedheadshotValid(mug));

    SendNUIMessage({
      mugshot: GetPedheadshotTxdString(mug),
    });

    UnregisterPedheadshot(mug);
  }, 500);
}

onNet('playerSpawned', () => {
  setTimeout(getMugshot, 2000);
});
setTimeout(getMugshot, 1000);

on('onClientResourceStop', (resourceName) => {
  if (GetCurrentResourceName() != resourceName) {
    return;
  }
  if (!mug) {
    return;
  }
  UnregisterPedheadshot(mug);
});

setInterval(async () => {
  const ped = PlayerPedId();
  const playerId = PlayerId();

  SendNUIMessage({
    visible: !IsPauseMenuActive(),
    health: GetEntityHealth(ped) - 100,
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
