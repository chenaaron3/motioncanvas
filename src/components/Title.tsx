import { Txt, TxtProps } from '@motion-canvas/2d';
import {
    easeInBack, easeInCubic, easeOutBounce, easeOutCirc, easeOutCubic, easeOutElastic, easeOutExpo,
    easeOutQuad, easeOutQuart, easeOutQuint, easeOutSine, ThreadGenerator
} from '@motion-canvas/core';

import { ExpressionProps } from './Expression';
import { SoundEffects } from './SoundEffects';

export interface TitleProps extends TxtProps {
}

export class Title extends Txt {
    constructor(props: TitleProps) {
        super(props);
        this.textAlign('center');
        this.fill('white');
    }

    *show(title: string): ThreadGenerator {
        SoundEffects.intro();
        yield* this.text(title, 1);
    }

    *dismiss(): ThreadGenerator {
        SoundEffects.move();
        yield* this.y(-350, 1, easeOutQuint);
    }
}