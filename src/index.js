import FixedDeltaTime from './fixed-delta-time';
import VariableDeltaTime from './variable-delta-time';
import SemiFixedTimeStep from './semi-fixed-time-step';
import FixedTimeStep from './fixed-time-step';
import FixedTimeStepWithRemainder from './fixed-time-step-with-remainder';

export const createFixedDeltaTime = FixedDeltaTime;
export const createVariableDeltaTime = VariableDeltaTime;
export const createSemiFixedTimeStep = SemiFixedTimeStep;
export const createFixedTimeStep = FixedTimeStep;
export const createFixedTimeStepWithRemainder = FixedTimeStepWithRemainder;