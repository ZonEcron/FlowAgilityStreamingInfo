# flow-demo

## Purpose

Manual FlowAgility replay fixture combining the main example states into one ordered sequence.


## File

- `fixtures/flow/flow-demo.json`


## Covered Behavior

This fixture is useful to verify:

1. no runs ready yet
2. first `run_ready` competitor
3. active `run` with a fault while running
4. calculated `run` with populated `results_best` and `results_combined`
5. calculated `run` where a new invented team enters first in both course and combined results
6. a second calculated snapshot keeping the same invented team visible in both rankings


## Step-By-Step Meaning

1. `error: "Runs are not ready yet"`
   Useful to verify that the replay can start from a state with no active run data.

2. `run_ready`
   First competitor is ready to enter the ring.
   Useful to verify next-team handling and delayed transitions.

3. `run`
   Competitor is actively running with `faults = 1`.
   Useful to verify current-team updates during a live run.

4. `run`
   Competitor is calculated and both `results_best` and `results_combined` are populated.
   Useful to verify course results and combined results rendering in one step.

5. `run`
   Invented team `Pixel / Harper Wells` is calculated and inserted into both rankings.
   Useful to verify sorting rules:
   - fewer faults/refusals first
   - ties resolved by lower time
   - elimination treated as the worst result

6. `run`
   Another calculated snapshot keeps `Pixel / Harper Wells` visible at the top of both rankings.
   Useful to verify that the replay can advance through more than one combined-results state without losing the inserted team.


## Expected Notes

- This fixture is intentionally compact and ordered for manual replay with the `Replay` panel.
- It is based on the official FlowAgility streaming examples and normalized for this repository.
