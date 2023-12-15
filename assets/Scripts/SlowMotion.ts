import { Director } from "cc";
import { setCustomFrameRate } from './FrameRateControl'; 

const getOrCreateSlomoPolyfill = (() => {
    let polyfill: undefined | { multiplier: number };

    return () => {
        if (!polyfill) {
            const polyfill_ = { multiplier: 1.0 };
            const tick = Director.prototype.tick;
            Director.prototype.tick = function (dt: number, ...args) {
                tick.call(this, dt * polyfill_.multiplier, ...args);
            };
            polyfill = polyfill_;
        }
        return polyfill;
    };
})();

export function enableSlowMotion() {
    getOrCreateSlomoPolyfill().multiplier = 0.6;
    setCustomFrameRate(140); 

}

export function disableSlowMotion() {
    getOrCreateSlomoPolyfill().multiplier = 1.0;
    setCustomFrameRate(60); 

}

export async function enableSlowMotionForDuration(durationInSeconds: number) {
    enableSlowMotion();

    await new Promise(resolve => setTimeout(resolve, durationInSeconds * 1000));

    disableSlowMotion();
}
