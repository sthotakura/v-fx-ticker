<template>
  <div class="ticker-container">
    <div class="ticker-header">
      <div
          class="market-status-indicator"
          :class="{open: isMarketOpen}">
      </div>
      <div class="symbol" :title="symbol">
        {{symbol}}
      </div>
      <div class="timestamp">
        {{displayTimestamp}}
      </div>
    </div>
    <div class="ticker-body">
      <div class="bid" :class="bidState" ref="bid">
        <div class="label">Bid</div>
        <div class="price">{{bid}}</div>
      </div>
      <div class="spread">{{spread}}</div>
      <div class="ask" :class="askState" ref="ask">
        <div class="label">Ask</div>
        <div class="price">{{ask}}</div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "FxTicker",

        props: {
            isMarketOpen: {type: Boolean, default: false},
            symbol: {type: String, required: true},
            mid: {type: Number, required: true},
            spread: {type: Number, required: true},
        },

        data() {
            return {
                timestamp: new Date(Date.now()),
                bidState: undefined,
                askState: undefined
            }
        },

        computed: {
            bid() {
                return (this.mid - (this.spread / 2.0)).toFixed(2);
            },
            ask() {
                return (this.mid + (this.spread / 2.0)).toFixed(2);
            },
            displayTimestamp() {
                return `${this.timestamp.getHours()}:${String(this.timestamp.getMinutes()).padStart(2, '0')}:${String(this.timestamp.getSeconds()).padStart(2, '0')}`;
            }
        },

        watch: {
            mid() {
              this.timestamp = new Date(Date.now());
            },
            bid(newValue, oldValue) {
                this.bidState = (oldValue > newValue ? "tick-down" : (oldValue < newValue ? "tick-up" : undefined));
                if (this.bidState) {
                    this.$refs.bid.addEventListener('animationend', this.handleBidAnimationEnded);
                }
            },
            ask(newValue, oldValue) {
                this.askState = (oldValue > newValue ? "tick-down" : (oldValue < newValue ? "tick-up" : undefined));
                if (this.askState) {
                    this.$refs.ask.addEventListener('animationend', this.handleAskAnimationEnded);
                }
            }
        },

        methods: {
            handleBidAnimationEnded() {
                this.$refs.bid.removeEventListener('animationend', this.handleBidAnimationEnded);
                this.bidState = undefined;
            },
            handleAskAnimationEnded() {
                this.$refs.ask.removeEventListener('animationend', this.handleAskAnimationEnded);
                this.askState = undefined;
            }
        }
    }
</script>

<style scoped>
  .ticker-container {
    width: 250px;
    border: 2px #707070 solid;
    color: #707070;
    cursor: default;
    background: linear-gradient(#fff, #eee, #eee, #eee, #eee, #ddd, #ccc);
  }

  .ticker-header {
    display: flex;
    flex-flow: row nowrap;
    border-bottom: 2px #707070 solid;
  }

  .ticker-header .market-status-indicator {
    width: 1rem;
    height: 1rem;
    background-color: #bbb;
    border-radius: 50%;
    margin: 0.25rem 0.5rem 0.25rem 0.5rem;
  }

  .ticker-header .market-status-indicator.open {
    background-color: #00BC2C;
  }

  .ticker-header .symbol {
    font-weight: bold;
    text-align: left;
    align-self: flex-end;
    margin-right: 2rem;
    flex: 1 0 auto;
  }

  .ticker-header .timestamp {
    text-align: right;
    margin-right: 0.125rem;
    align-self: center;
    font-size: 0.8rem;
  }

  .ticker-body {
    display: flex;
    flex-flow: row nowrap;
    padding: 0.25rem;
  }

  .spread {
    align-self: flex-end;
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: -0.25rem;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    min-width: 1.5rem;
  }

  .bid, .ask {
    font-weight: bold;
    font-size: 1.5rem;
    text-align: right;
    display: flex;
    flex-flow: column nowrap;
  }

  .bid .label {
    align-self: flex-end;
    font-size: 0.8rem;
  }

  .ask .label {
    align-self: flex-start;
    font-size: 0.8rem;
  }

  .bid.tick-up .price, .ask.tick-up .price{
    animation: tick-up 0.3s;
  }

  .bid.tick-down .price, .ask.tick-down .price {
    animation: tick-down 0.3s;
  }

  @keyframes tick-up {
    0% {
      color: #00BC2C;
    }
    50% {
      color: #00BC2C;
    }
    100% {
      color: #707070;
    }
  }

  @keyframes tick-down {
    0% {
      color: #BC0007;
    }
    50% {
      color: #BC0007;
    }
    100% {
      color: #707070;
    }
  }
</style>