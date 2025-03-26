# Lesson 2: Immutability

Instead of a box, a variable is actually like a nametag for the box.
x points to a box with the value

```
x = 1 // Separate variable and box with an arrow
y = x // Create another box
```

Chapter 3: Mutability
Primitive types are immutable, meaning that they cannot be changed.
When reading a variable with an immutable data type, a copy is made instead.
Here is an example. We set x to 5 and y to x.
Because numbers are immutable, y recieves a copy of the value 5.
When we reassign 3 to y, our x remains the same.
Immutability is a property of the value, not the variable.

```
x = 5
y = x
y = 3
// x = 5
// y = 3
```

Chapter 4:
If numbers are mutable, then we will not be using a copy.

```
x = 5
y = x
y = 3
// x = 3
// y = 3
```
