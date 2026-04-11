# zon-0001

## Purpose

Manual ZonEcron fixture covering a realistic sequence of timer commands and score changes.


## File

- `fixtures/zonecron/zon-0001.txt`


## Covered Behavior

This fixture is useful to verify:

1. start of live timing
2. refusal added while the timer is running
3. stop with the refusal preserved
4. later correction of the stored result by adding a fault
5. reset behavior
6. recognition-related telegrams (`o` and `g`) with the current expected visual reset behavior
7. a second live run with faults added during timing
8. elimination while the timer is still running
9. final stopped result preserving elimination


## Line-By-Line Meaning

1. `i0000000000`
   start timing at `0.000`, F/R/E = `0/0/0`

2. `i0100002228`
   running at `2.228`, F/R/E = `0/1/0`

3. `p0100005979`
   stopped at `5.979`, F/R/E = `0/1/0`

4. `p1100005979`
   same stopped time `5.979`, corrected result now F/R/E = `1/1/0`

5. `p0000000000`
   reset

6. `o0000420000`
   recognition-related telegram, current expected app behavior is visual reset

7. `g0000420000`
   recognition-related telegram, current expected app behavior is visual reset

8. `p0000000000`
   reset

9. `i0000000000`
   start second sequence

10. `i1000002202`
    running at `2.202`, F/R/E = `1/0/0`

11. `i2000003944`
    running at `3.944`, F/R/E = `2/0/0`

12. `i2010005772`
    running at `5.772`, F/R/E = `2/0/1`

13. `p2010010958`
    stopped at `10.958`, F/R/E = `2/0/1`


## Expected Notes

- If Flow is connected, timer F/R/E should be logged but should not override on-screen F/R/E values.
- If Flow is disconnected, the timer F/R/E values should drive the visible on-screen score state.
- This fixture is intended for manual verification, not automated replay yet.
