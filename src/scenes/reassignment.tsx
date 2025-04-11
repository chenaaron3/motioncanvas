import { Code, CODE, initialize, lines, makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import {
    all, chain, createRef, DEFAULT, fadeTransition, makeRef, waitFor
} from '@motion-canvas/core';

import { Expression } from '../components/Expression';
import { Title } from '../components/Title';
import { Variable } from '../components/Variable';
import { Colors } from '../utils/utils';

export default makeScene2D(function* (view) {
    view.fill(Colors.Background);

    // Refs
    const codeRef = createRef<Code>();
    const titleRef = createRef<Title>();
    const boardRefs = {
        board: null as Rect,
        x: null as Variable,
        y: null as Variable,
    };

    view.add(
        <>
            <Title ref={titleRef} />
            <Code ref={codeRef} x={-350} />
            <Rect ref={makeRef(boardRefs, 'board')} x={350}>
                <Rect>
                    <Variable ref={makeRef(boardRefs, 'x')} />
                    <Variable ref={makeRef(boardRefs, 'y')} />
                </Rect>
            </Rect>
        </>
    )

    yield* fadeTransition(1);

    // Introduce expressions
    yield* titleRef().show("Reassignment");
    yield* waitFor(2);

    // Reveal code
    yield* chain(
        titleRef().dismiss(),
        codeRef().code(CODE`x = 1`, 1),
        boardRefs.x.initialize("x", "1"),
    )

    // Reassign 2
    yield* all(
        codeRef().code.append(CODE`\nx = 2`, 1),
        codeRef().selection(lines(1), 1),
    )
    yield* boardRefs.x.assignValue("2");

    // Reassign 3
    yield* all(
        codeRef().code.append(CODE`\nx = 3`, 1),
        codeRef().selection(lines(2), 1),
    )
    yield* boardRefs.x.assignValue("3");

    // Assign to separate variable
    yield* all(
        codeRef().code.append(CODE`\ny = 4`, 1),
        codeRef().selection(lines(3), 1),
    )
    yield* all(
        boardRefs.x.x(-125, 1),
        boardRefs.y.x(125, 1),
        boardRefs.y.initialize("y", "4"),
    )

    // Reassign 5
    yield* all(
        codeRef().code.append(CODE`\ny = 5`, 1),
        codeRef().selection(lines(4), 1),
    )
    yield* boardRefs.y.assignValue("5");

    // Consider dependent variables
    yield* all(
        codeRef().selection(DEFAULT, 1),
        codeRef().code(CODE`x = 1`, 1),
        boardRefs.x.reset(),
        boardRefs.y.reset(),
    )
    yield* boardRefs.x.assignValue("1");

    // Assign y to x
    yield* all(
        codeRef().code.append(CODE`\ny = x`, 1),
        codeRef().selection(lines(1), 1),
    )
    yield* boardRefs.y.assignValue("x", [boardRefs.x]);

    // When changing y, x remains unchanged
    yield* all(
        codeRef().code.append(CODE`\ny = 2`, 1),
        codeRef().selection(lines(2), 1),
    )
    yield* boardRefs.y.assignValue("2");

    yield* waitFor(2);
});