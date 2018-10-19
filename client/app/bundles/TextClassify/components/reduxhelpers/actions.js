
export const actions = {
    MODEL_UPDATE: 1,
    TEXT_UPDATE: 2,
    DEFAULTS_UPDATE: 3,
}

export function updateModel(model) {
    return {
      model: model,
      type: actions.MODEL_UPDATE,
    }
};

export function updateText(text) {
    return {
      text: text,
      type: actions.TEXT_UPDATE,
    }
};

export function setDefaults(model, text) {
    return {
        model: model,
        text: text,
        type: actions.DEFAULTS_UPDATE,
    };
}
