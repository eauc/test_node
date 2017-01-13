import R from 'ramda';

module.exports = {
  effects,
  registerEffect,
};

let EFFECTS = {};

function registerEffect(effectName, effect) {
  console.info(`Register effect ${effectName}`);
  EFFECTS[effectName] = effect;
}

function effects(handler) {
  return function (state, event) {
    const effectsMap = handler(state, event);
    R.forEach((effectName) => {
      const effectValue = effectsMap[effectName];
      if (!EFFECTS[effectName]) {
        console.warn(`Unknown effect ${effectName}`, effectValue);
        return;
      }
      console.info(`Resolve effect ${effectName}`, effectValue);
      EFFECTS[effectName](effectValue, event);
    }, R.without(['state'], R.keys(effectsMap)));
    return effectsMap.state;
  };
}
