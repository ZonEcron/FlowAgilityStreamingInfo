# Galican-demo

## Purpose

Manual Galican fixture covering two representative runs with score changes and a later offline correction.


## File

- `fixtures/galican/Galican-demo.json`


## Covered Behavior

This fixture is useful to verify:

1. start of live timing
2. fault added while the timer is running
3. refusal added while the timer is running
4. stop with the current score preserved
5. second run start
6. second run with a running fault
7. stop of the second run
8. later correction of the stopped result by adding another fault
9. later correction of the same stopped result by marking elimination


## Item-By-Item Meaning

1. running at `0.116`, F/R/E = `0/0/0`

2. running at `2.166`, F/R/E = `1/0/0`

3. running at `4.166`, F/R/E = `1/1/0`

4. stopped at `6.166`, F/R/E = `1/1/0`

5. running at `0.024`, F/R/E = `0/0/0`

6. running at `2.024`, F/R/E = `1/0/0`

7. stopped at `6.024`, F/R/E = `1/0/0`

8. same stopped time `6.024`, corrected to F/R/E = `2/0/0`

9. same stopped time `6.024`, corrected to F/R/E = `2/0/1`


## Expected Notes

- If Flow is connected, Galican score changes should be logged but should not override on-screen F/R/E values.
- If Flow is disconnected, Galican score changes should drive the visible on-screen score state.
- Galican real traffic tends to spam frequent status snapshots. This reduced fixture keeps only meaningful changes for manual replay.
