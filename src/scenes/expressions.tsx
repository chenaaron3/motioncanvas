import { Code, CODE, makeScene2D } from '@motion-canvas/2d';
import { createRef } from '@motion-canvas/core';

import { CircumscribeRect } from '../components/Circumscribe';

export default makeScene2D(function* (view) {
    view.fill('#141414');
    const value = Code.createSignal(`1`);
    const codeRef = createRef<Code>();

    view.add(
        <Code
            ref={codeRef}
            fontSize={50}
            fontFamily="monospace"
            code={CODE`1 + 3`}
            fill={"white"}
        />
    )

    yield* CircumscribeRect(codeRef, "yellow");
    // Create expression by itself 1 + 3
    yield* codeRef().code(CODE`4`, 1);
    // Introduce different expressions by swapping operator
    // Animate evaluation

});