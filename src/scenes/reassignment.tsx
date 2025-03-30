import { CODE, Code, makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import { createRef, makeRef, waitFor } from '@motion-canvas/core';

import { Expression } from '../components/Expression';
import { Variable } from '../components/Variable';
import { Colors } from '../utils/utils';

export default makeScene2D(function* (view) {
    view.fill(Colors.Background);

    // Refs
    const codeRef = createRef<Code>();
    const txtRef = createRef<Txt>();
    const boardRef = createRef<Rect>();
    const boardRefs = {
        board: null as Rect,
        x: null as Variable,
        y: null as Variable,
        z: null as Variable,
        expression: null as Expression
    };

    view.add(
        <>
            <Txt textAlign={'center'} ref={txtRef} fill={"white"}></Txt>
            <Code
                ref={codeRef}
            />
            <Rect ref={boardRef} x={350}>
                <Rect>
                    <Variable ref={makeRef(boardRefs, 'x')} />
                    <Variable ref={makeRef(boardRefs, 'y')} />
                </Rect>
            </Rect>
        </>
    )

    // Introduce expressions
    yield* txtRef().text("Reassignment", 1);
    yield* waitFor(2);

    // Reveal code
    yield* txtRef().y(-350, 1);
    yield* codeRef().code(CODE`x = 1`, 1);
    yield* codeRef().code.append(CODE`\nx = 2`, 1);

    /*
        x = 1
        x = 2
        y = 3
        y = 4
    */

    yield* waitFor(10);

});