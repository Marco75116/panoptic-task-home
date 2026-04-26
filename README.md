# HyperUnicorn Points System

## Design at a glance

Under the hood, Uniswap V3 concentrated LP positions are the engine that produces HyperUnicorn's perpetual-style exposure — but that mechanic is abstracted away. From the user's perspective there are only two ways to interact with the protocol:

- **Lend a token to a vault** — Track A. The vault manages positions on the depositor's behalf.
- **Trade directly using a token as collateral** — Track B. Advanced users open and manage their own positions.

For simplicity, **USDC is the only token** in this implementation (vault deposits and trader collateral).

Both tracks share **one formula** around usd value:

```
points = floor(value_USD × usd_weight × time_held × boost × scale)
```

| Parameter     | What it represents                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| `value_USD`   | Dollar amount tied up in the protocol. Track A: vault deposit balance. Track B: open-position notional.             |
| `usd_weight`  | Per-dollar protocol-value multiplier. Track A: baseline. Track B: premium (riskier + pays fees).                    |
| `time_held`   | How long `value_USD` was tied up during the epoch.                                                                  |
| `boost`       | Per-user multiplicative bonus — lets the protocol steer rewards toward users and behaviors it wants to incentivize. |
| `scale`       | Global integer factor calibrated so points land in a readable whole-number range (e.g. `$1 × 1 day` ≈ 100 points).  |
| `floor()`     | Rounds down so points are always integers — no fractional display.                                                  |

A user can participate in both tracks. Their total is simply:

```
user_points = points_track_A + points_track_B
```

Track A uses **daily** epochs. Depositors treat their points as a stable funds rate — their headline yield — so daily distribution keeps that rate predictable.

## Resistance to abuse

| Case                          | What it looks like                                                            | How the system resists it                                                                |
| ----------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| JIT deposit at peak hours     | Depositor only stakes during the high-volume part of the day and withdraws the rest, harvesting points when capital is most useful | 24h min-hold on Track A — intervals shorter than 24h don't count, so users can't cherry-pick a few peak hours per day |
| Wash trade / self-fill        | Trader opens and closes mirrored positions in seconds to inflate notional-time | Acceptable — every round-trip pays protocol fees, so the "abuse" is actually paid revenue |
| Sybil farming                 | One whale splits funds across many wallets                                    | Not a problem — formula is linear in `value × time`, so splitting earns the same total points as one wallet |

