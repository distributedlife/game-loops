# Game Loops

Various implementations of game loops. Most of which I have implemented at one time or another. I grow weary of rewriting this code. Here it is for viewing or usage. There are tests too. If you want detail explanation on why you may want one over another read [Fix your timestep by Glenn Fielder](http://gafferongames.com/game-physics/fix-your-timestep/).

- fixed delta time
- variable delta time
- semi fixed timestep
- fixed timestep
- fixed timestep with remainder

# Creating a loop

```javascript
import {
  createFixedDeltaTime,
  createVariableDeltaTime,
  createSemiFixedTimestep,
  createFixedTimeStep,
  createFixedTimeStepWithRemainder
} from 'game-loops';

const ms = 1000 / 60;
const onFrame = (Δ, t) => { ... };
const onRemainder = (Δ, t) => { ... };
const isPaused = () => false;

const fixedDeltaTime = createFixedDeltaTime(ms, isPaused, onFrame);
const variableDeltaTime = createVariableDeltaTime(isPaused, onFrame);
const semiFixedTimeStep = createSemiFixedTimestep(ms, isPaused, onFrame);
const fixedTimeStep = createFixedTimeStep(ms, isPaused, onFrame);
const withRemainder = createFixedTimeStepWithRemainder(ms, isPaused, onFrame, onRemainder);
```

# Hooking it into a scheduler

```javascript
setInterval(fixedDeltaTime, 1000 / 60);
setInterval(variableDeltaTime, 1000 / 60);
setInterval(semiFixedTimeStep, 1000 / 60);
setInterval(fixedTimeStep, 1000 / 60);
setInterval(withRemainder, 1000 / 60);
```

or you can call it on demand

```javascript
fixedDeltaTime();
variableDeltaTime();
semiFixedTimeStep();
fixedTimeStep();
withRemainder();
```

# Common behaviour
- They all accept a function that should return true if paused and false if not paused. No callbacks are executed when paused.
- All callbacks receive the delta as the first parameter
- All callbacks receive the elapsed game time as the second parameter.

# fixed delta time
Calls your function with a fixed time delta everytime you invoke it. You could probably just do this yourself.

# variable delta time
Calculates time between invocations and uses that as the delta.

# semi fixed timestep
As variable but caps it at a delta you define.

# fixed timestep
Set the timestep to some number of milliseconds. Say 1000/60 for 60 frames per second. This means that the callback will _always_ receive the timestep specified on frame.

# fixed timestep with remainder
Like fixed timestep but your `onRemainder` function is called with the remainder of ms. You can determine how far through a frame you are to render the world. It's up to tou.