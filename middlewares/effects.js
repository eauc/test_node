import R from 'ramda';

let EFFECTS = {};

module.exports = ({
  services: { logger: { default: logger } },
}) => {
  return {
    effects,
    registerEffect,
  };

  function registerEffect(effectName, effect) {
    logger('debug', `Register effect ${effectName}`);
    EFFECTS[effectName] = effect;
  }

  function effects(handler) {
    return function (event, coeffects) {
      const effectsMap = handler(event, coeffects);
      R.forEach((effectName) => {
        const effectValue = effectsMap[effectName];
        if (!EFFECTS[effectName]) {
          logger('warn', `Unknown effect ${effectName}`, effectValue);
          return;
        }
        logger('debug', `Resolve effect ${effectName}`, effectValue);
        EFFECTS[effectName](effectValue, event, coeffects);
      }, R.keys(effectsMap));
      return effectsMap.state;
    };
  }
};
