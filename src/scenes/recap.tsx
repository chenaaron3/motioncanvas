import { CODE, Code, lines, makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import {
    all, chain, createRef, DEFAULT, fadeTransition, makeRef, waitFor
} from '@motion-canvas/core';

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
        z: null as Variable,
    };

    view.add(
        <>
            <Title ref={titleRef} />
            <Code ref={codeRef} x={-350} />
            <Rect ref={makeRef(boardRefs, 'board')} x={350}>
                <Rect>
                    <Variable ref={makeRef(boardRefs, 'x')} />
                    <Variable ref={makeRef(boardRefs, 'y')} />
                    <Variable ref={makeRef(boardRefs, 'z')} />
                </Rect>
            </Rect>
        </>
    )

    yield* fadeTransition(1);

    // Show title
    yield* titleRef().show("Recap");
    yield* waitFor(2);

    // Assignment
    yield* chain(
        titleRef().dismiss(),
        codeRef().code(CODE`\
// Assignment
x = 1`, 1),
        boardRefs.x.initialize("x", "1"),
    )

    // Expressions
    yield* all(
        codeRef().code.append(CODE`
// Expressions
y = x + 2`, 1),
        codeRef().selection(lines(2, 3), 1),
        boardRefs.x.y(-100, 1),
        boardRefs.y.y(100, 1),
    )
    yield* boardRefs.y.declare("y");
    yield* boardRefs.y.assignValue("x + 2", [boardRefs.x], "3");

    // Reassignment
    yield* all(
        codeRef().code.append(CODE`
// Reassignment
y = 4`, 1),
        codeRef().selection(lines(4, 5), 1),
    )
    yield* boardRefs.y.assignValue("4");

    // Data Types
    yield* all(
        codeRef().code.append(CODE`
// Data Types
z = "HE" + "HE"`, 1),
        codeRef().selection(lines(6, 7), 1),
        boardRefs.x.y(-175, 1),
        boardRefs.y.y(0, 1),
        boardRefs.z.y(175, 1),
    )
    yield* boardRefs.z.declare("z");
    yield* boardRefs.z.assignValue('"HE"+"HE"', [], '"HEHE"');
    yield* codeRef().selection(DEFAULT, 1);
    yield* waitFor(2);
});