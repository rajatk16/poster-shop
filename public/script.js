let watcher;

Vue.createApp({
  data() {
    return {
      total: 0.00,
      cart: [],
      search: "cat",
      lastSearch: "",
      loading: false,
      results: [],
      listLength: 0
    };
  },
  computed: {
    products() {
      return this.results.slice(0, this.listLength);
    }
  },
  created() {
    this.onSubmit();
  },
  updated() {
    const sensor = document.querySelector("#product-list-bottom");
    watcher = scrollMonitor.create(sensor);
    watcher.enterViewport(this.appendResults);
  },
  beforeUpdate() {
    if(watcher) {
      watcher.destroy();
      watcher = null;
    }
  },
  methods: {
    addToCart(product) {
      this.total += product.price;
      const item = this.cart.find(item => item.id === product.id);
      if (item) {
        item.qty++;
      } else {
        this.cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          qty: 1
        });
      }
    },
    currency(price) {
      return `$${price.toFixed(2)}`;
    },
    inc(item) {
      item.qty++;
      this.total += item.price;
    },
    dec(item) {
      item.qty--;
      this.total -= item.price;
      if (item.qty <= 0) {
        const i = this.cart.indexOf(item);
        this.cart.splice(i, 1);
      }
    },
    onSubmit() {
      this.results = [];
      this.listLength = 0;
      this.loading = true;
      fetch(`/search?q=${this.search}`)
        .then(res => res.json())
        .then(body => {
          this.lastSearch = this.search;
          this.results = body;
          this.appendResults();
          this.loading = false;
        });
    },
    appendResults() {
      if (this.products.length < this.results.length) {
        this.listLength += 4; 
      }
    }
  }
}).mount("#app");