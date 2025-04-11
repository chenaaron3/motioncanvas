import {
    CODE, Code, CodeProps, Layout, LayoutProps, PossibleCodeScope, Rect
} from '@motion-canvas/2d';
import {
    all, createRef, createSignal, makeRef, range, SignalValue, unwrap, useLogger
} from '@motion-canvas/core';

import { Circumscribe } from './Circumscribe';
import { SoundEffects } from './SoundEffects';
import { Variable } from './Variable';

export interface ExpressionProps extends CodeProps {
}

export class Expression extends Code {
    constructor(props: ExpressionProps) {
        super(props);
    }

    // Evaluate this expression
    *evaluate(code: SignalValue<PossibleCodeScope>) {
        const circ = new Circumscribe({
            target: this
        });
        yield* circ.create("yellow");
        SoundEffects.eval(.25);
        // Collapses into the evaluated value
        yield* all(
            circ.destroy(),
            this.code(code, 1)
        );
    }

    // Given a variable within the expression, replace it with the variable's value
    // Can we draw an arrow from the variable?
    *evaluateVariable(
        variable: Variable
    ) {
        const r = this.findFirstRange(variable.getName());
        // "getSelectionBBox" returns an array of bboxes,
        // one for each line in the range. You can just
        // use the first one for this example.
        const bboxes = this.getSelectionBBox(r);
        const first = bboxes[0];
        const range = first.expand([4, 8]);

        // Create a rect so the circumscribe can target it
        let rect = <Rect
            offset={-1}
            position={range.position}
            size={range.size}
            lineWidth={5}
            stroke={'yellow'}
            radius={8}
            end={0}
        /> as Rect;
        this.add(rect);

        SoundEffects.eval(.25);
        // Highlight
        yield* all(
            variable.highlight(),
            rect.end(1, 1)
        )

        // Evaluate the variable
        yield* all(
            variable.unhighlight(),
            rect.start(1, 1),
            this.code.replace(
                this.findFirstRange(variable.getName()),
                variable.getValue(),
                1,
            ),
        );
        this.removeChild(rect);
        rect.remove();
    }
}